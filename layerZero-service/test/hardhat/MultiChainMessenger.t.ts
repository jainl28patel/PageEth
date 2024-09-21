import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from "chai";
import { Contract, ContractFactory } from 'ethers';
import { ethers } from "hardhat";
import { Options } from '@layerzerolabs/lz-v2-utilities';


describe('MultiChainMessenger Test', function () {
    const eidA = 1;
    const eidB = 2;

    let MultiChainMessenger: ContractFactory;
    let EndpointV2Mock: ContractFactory;
    let ownerA: SignerWithAddress;
    let ownerB: SignerWithAddress;
    let endpointOwner: SignerWithAddress;
    let messengerA: Contract;
    let messengerB: Contract;
    let mockEndpointV2A: Contract;
    let mockEndpointV2B: Contract;

    before(async function () {
        MultiChainMessenger = await ethers.getContractFactory('MultiChainMessenger');

        const signers = await ethers.getSigners();
        ownerA = signers[0];
        ownerB = signers[1];
        endpointOwner = signers[2];

        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock');
        EndpointV2Mock = new ContractFactory(EndpointV2MockArtifact.abi, EndpointV2MockArtifact.bytecode, endpointOwner);
    });

    beforeEach(async function () {
        mockEndpointV2A = await EndpointV2Mock.deploy(eidA);
        mockEndpointV2B = await EndpointV2Mock.deploy(eidB);

        const rateLimitConfig = [{ dstEid: eidB, limit: 1000, window: 3600 }];
        messengerA = await MultiChainMessenger.deploy(mockEndpointV2A.address, ownerA.address, rateLimitConfig);
        messengerB = await MultiChainMessenger.deploy(mockEndpointV2B.address, ownerB.address, rateLimitConfig);

        await mockEndpointV2A.setDestLzEndpoint(messengerB.address, mockEndpointV2B.address);
        await mockEndpointV2B.setDestLzEndpoint(messengerA.address, mockEndpointV2A.address);

        await messengerA.connect(ownerA).setPeer(eidB, ethers.utils.zeroPad(messengerB.address, 32));
        await messengerB.connect(ownerB).setPeer(eidA, ethers.utils.zeroPad(messengerA.address, 32));
    });

    it('should send a message to the destination chain', async function () {
        const sender = "Alice";
        const data = "Hello, LayerZero!";
        const key = "12345";
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();

        const dstEids = [eidB];
        const quoteResult = await messengerA.quote(eidB, sender, data, key, options);

        // Send the message
        await expect(messengerA.sendMessage(dstEids, sender, data, key, options, { value: quoteResult.nativeFee }))
        .to.emit(messengerA, 'MessageSent')
        .withArgs(eidB, sender, data, key);

        // Simulate the message being received on chain B
        await mockEndpointV2B.lzReceive(
            eidA, 
            messengerB.address, 
            0, 
            ethers.utils.defaultAbiCoder.encode(['string', 'string', 'string'], [sender, data, key])
        );

        // Check if the message was received on chain B
        expect(await messengerB.data()).to.equal(data);

        // Check if the MessageReceived event was emitted on chain B
        const receivedEvents = await messengerB.queryFilter(messengerB.filters.MessageReceived());
        expect(receivedEvents).to.have.lengthOf(1);
        expect(receivedEvents[0].args.srcEid).to.equal(eidA);
        expect(receivedEvents[0].args.sender).to.equal(sender);
        expect(receivedEvents[0].args.data).to.equal(data);
        expect(receivedEvents[0].args.key).to.equal(key);
    });
});