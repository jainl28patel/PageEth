const { ethers } = require("hardhat");
const { EndpointId } = require("@layerzerolabs/lz-definitions");
const { Options } = require("@layerzerolabs/lz-v2-utilities");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const MultiChainMessenger = await ethers.getContractFactory("MultiChainMessenger");

  const contractAddresses = {
    'polygon-amoy': "0xd361fB0919b6B2AaEC39cDEe3EBA749D67F632A2",
    'base-sepolia': "0xd361fB0919b6B2AaEC39cDEe3EBA749D67F632A2",
    'optimism-sepolia': "0x1d000796c60c67bE3c0117f50bc88056D15A0fd7"
  };

  const sourceNetwork = 'polygon-amoy';
  console.log("Source network:", sourceNetwork);
  console.log("Contract address:", contractAddresses[sourceNetwork]);

  const messenger = await MultiChainMessenger.attach(contractAddresses[sourceNetwork]);

  const dstEids = [
    40245, // Base Sepolia
    40232  // Optimism Sepolia
  ];

  const sender = "Alice";
  const data = "Hello, LayerZero!";
  const key = "12345";

  console.log(`Sending message from ${sourceNetwork} to multiple chains...`);
  console.log("Message details:");
  console.log("  Sender:", sender);
  console.log("  Data:", data);
  console.log("  Key:", key);

  try {
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();

    console.log("Attempting to call quote function...");
    const quoteResult = await messenger.quote(dstEids[0], sender, data, key, options);
    console.log("Quote for first destination:", ethers.utils.formatEther(quoteResult.nativeFee), "ETH");

    const estimatedTotalFee = quoteResult.nativeFee.mul(dstEids.length);
    console.log("Estimated total fee:", ethers.utils.formatEther(estimatedTotalFee), "ETH");

    console.log("Sending transaction...");
    const tx = await messenger.sendMessage(dstEids, sender, data, key, options, { value: estimatedTotalFee });
    console.log("Transaction sent. Hash:", tx.hash);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log("Transaction confirmed successfully!");
      console.log("Block number:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      
      const messageSentEvents = receipt.events.filter(e => e.event === 'MessageSent');
      if (messageSentEvents.length > 0) {
        console.log("MessageSent events:");
        messageSentEvents.forEach((event, index) => {
          console.log(`  Event ${index + 1}:`);
          console.log(`    Destination EID: ${event.args.dstEid}`);
          console.log(`    Sender: ${event.args.sender}`);
          console.log(`    Data: ${event.args.data}`);
          console.log(`    Key: ${event.args.key}`);
        });
      } else {
        console.log("No MessageSent events found. This might indicate an issue with cross-chain messaging.");
      }
    } else {
      console.log("Transaction failed!");
    }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.transaction) {
      console.log("Failed transaction hash:", error.transactionHash);
    }
    if (error.reason) {
      console.log("Error reason:", error.reason);
    }
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exitCode = 1;
});