const { ethers } = require("hardhat");
const { EndpointId } = require("@layerzerolabs/lz-definitions");
const { Options } = require("@layerzerolabs/lz-v2-utilities");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const MyOApp = await ethers.getContractFactory("MyOApp");

  const contractAddresses = {
    'polygon-amoy': "0x7E342b8c79D2c32bC28a8aF6Ff0B7cdc525987d7",
    'base-sepolia': "0x83B17C51760027010C90Acb94E15C36c50AA3D3F",
    'optimism-sepolia': "0xF71329946E3357320895cbb6BF36F18641dA36c8"
  };

  const sourceNetwork = 'optimism-sepolia';
  console.log("Source network:", sourceNetwork);
  console.log("Contract address:", contractAddresses[sourceNetwork]);

  const myOApp = await MyOApp.attach(contractAddresses[sourceNetwork]);

  const dstEid = 40267;
  const message = "Hello, LayerZero!";

  console.log(`Sending message from ${sourceNetwork} to destination chain...`);
  console.log("Message:", message);

  try {
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();

    console.log("Attempting to call quote function...");
    const quoteResult = await myOApp.quote(dstEid, message, options, false);
    console.log("Quote for destination:", ethers.utils.formatEther(quoteResult.nativeFee), "ETH");

    console.log("Sending transaction...");
    const tx = await myOApp.send(dstEid, message, options, { value: quoteResult.nativeFee });
    console.log("Transaction sent. Hash:", tx.hash);
    
    console.log("Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log("Transaction confirmed successfully!");
      console.log("Block number:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      
      // Note: Your contract doesn't emit a MessageSent event, so we can't log it here
      console.log("Message sent successfully.");
    } else {
      console.log("Transaction failed!");
    }

    // Check the updated data on the destination chain (this won't work immediately due to cross-chain delay)
    console.log("Current data on source chain:", await myOApp.data());

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