// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import "@layerzerolabs/oapp-evm/contracts/oapp/utils/RateLimiter.sol";
import "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import "@layerzerolabs/oapp-evm/contracts/oapp/libs/OAppOptionsType3.sol";
import { MessagingParams, MessagingFee, MessagingReceipt } from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

contract MultiChainMessenger is OApp, RateLimiter, OAppOptionsType3 {
    event MessageSent(uint32 indexed dstEid, string sender, string data, string key);
    event MessageReceived(uint32 indexed srcEid, string sender, string data, string key);

    mapping(uint32 => uint64) private receivedNonces;
    uint16 public constant SEND_MESSAGE = 1;
    
    bool private _locked;

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    constructor(address _endpoint, address _owner, RateLimitConfig[] memory _rateLimitConfigs) 
        OApp(_endpoint, _owner)
        Ownable(_owner)
    {
        _setRateLimits(_rateLimitConfigs);
    }

    function sendMessage(uint32[] calldata dstEids, string memory sender, string memory data, string memory key, bytes calldata _options) 
        external 
        payable 
        nonReentrant 
    {
        require(bytes(sender).length > 0, "Sender cannot be empty");
        require(bytes(data).length > 0, "Data cannot be empty");
        require(bytes(key).length > 0, "Key cannot be empty");
        
        bytes memory payload = abi.encode(sender, data, key);
        uint256 totalFee = 0;
        
        for (uint i = 0; i < dstEids.length; i++) {
            _checkAndUpdateRateLimit(dstEids[i], 1);
            

            
            MessagingFee memory fee = _quote(dstEids[i], payload, _options, false);
            totalFee += fee.nativeFee;
            
            _lzSend(
                dstEids[i],
                payload,
                _options,
                MessagingFee(fee.nativeFee, 0),
                payable(msg.sender)
            );
            
            emit MessageSent(dstEids[i], sender, data, key);
        }
        
        require(msg.value >= totalFee, "Insufficient fee");
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        uint64 nonce = _origin.nonce;
        require(nonce == receivedNonces[_origin.srcEid] + 1, "Invalid nonce");
        receivedNonces[_origin.srcEid] = nonce;

        (string memory sender, string memory data, string memory key) = abi.decode(_message, (string, string, string));
        emit MessageReceived(_origin.srcEid, sender, data, key);
    }

    function quote(uint32 _dstEid, string memory sender, string memory data, string memory key, bytes memory _options) 
        public 
        view 
        returns (MessagingFee memory fee) 
    {
        bytes memory payload = abi.encode(sender, data, key);

        return _quote(_dstEid, payload, _options, false);
    }

    function setRateLimits(RateLimitConfig[] calldata _rateLimitConfigs) external onlyOwner {
        _setRateLimits(_rateLimitConfigs);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function _payNative(uint256 _nativeFee) internal override returns (uint256 nativeFee) {
        if (msg.value < _nativeFee) revert NotEnoughNative(msg.value);
        return _nativeFee;
    }
}