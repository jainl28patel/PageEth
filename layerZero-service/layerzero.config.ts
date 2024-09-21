import { EndpointId } from '@layerzerolabs/lz-definitions'
import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const polygonAmoyContract: OmniPointHardhat = {
    eid: 40267, // Polygon Amoy EID
    contractName: 'MyOApp',
}

const baseSepoliaContract: OmniPointHardhat = {
    eid: 40245, // Base Sepolia EID
    contractName: 'MyOApp',
}

const optimismSepoliaContract: OmniPointHardhat = {
    eid: 40232, // Optimism Sepolia EID
    contractName: 'MyOApp',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: polygonAmoyContract,
            config: {
                callerBpsCap: BigInt(300),
            },
        },
        {
            contract: baseSepoliaContract,
            config: {
                callerBpsCap: BigInt(300),
            },
        },
        {
            contract: optimismSepoliaContract,
            config: {
                callerBpsCap: BigInt(300),
            },
        },
    ],
    connections: [
        {
            from: polygonAmoyContract,
            to: baseSepoliaContract,
        },
        {
            from: polygonAmoyContract,
            to: optimismSepoliaContract,
        },
        {
            from: baseSepoliaContract,
            to: polygonAmoyContract,
        },
        {
            from: baseSepoliaContract,
            to: optimismSepoliaContract,
        },
        {
            from: optimismSepoliaContract,
            to: polygonAmoyContract,
        },
        {
            from: optimismSepoliaContract,
            to: baseSepoliaContract,
        },
    ],
}

export default config