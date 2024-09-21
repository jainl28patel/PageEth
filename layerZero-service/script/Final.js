const express = require("express");
const cors = require('cors');
const app = express();
app.use(express.json());

app.use(cors());

const { ethers } = require("hardhat");
const { EndpointId } = require("@layerzerolabs/lz-definitions");
const { Options } = require("@layerzerolabs/lz-v2-utilities");

async function main(msg) {
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const MyOApp = await ethers.getContractFactory("MyOApp");

  const contractAddresses = {
    'polygon-amoy': "0xF214eB925bDAAf31aab7391B025A52180FaaB74f",
    'base-sepolia': "0xd928A87f1653A8E28aa9EE095BeaCaEDC9676A2D",
    'optimism-sepolia': "0xF919Feb36d20da0590e2b99C479F38c8141EbF9D"
  };

  const sourceNetwork = 'optimism-sepolia';
  console.log("Source network:", sourceNetwork);
  console.log("Contract address:", contractAddresses[sourceNetwork]);

  const myOApp = await MyOApp.attach(contractAddresses[sourceNetwork]);

  const destinationNetworks = [
    { name: 'polygon-amoy', eid: 40267 },
    { name: 'base-sepolia', eid: 40245 },
    { name: 'optimism-sepolia', eid: 40232 }
  ];

  const message = msg;

  for (const destNetwork of destinationNetworks) {
    if (destNetwork.name === sourceNetwork) continue; // Skip if it's the source network

    console.log(`\nSending message from ${sourceNetwork} to ${destNetwork.name}...`);
    console.log("Message:", message);

    try {
      const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();

      console.log("Attempting to call quote function...");
      const quoteResult = await myOApp.quote(destNetwork.eid, message, options, false);
      console.log("Quote for destination:", ethers.utils.formatEther(quoteResult.nativeFee), "ETH");

      console.log("Sending transaction...");
      const tx = await myOApp.send(destNetwork.eid, message, options, { value: quoteResult.nativeFee });
      console.log("Transaction sent. Hash:", tx.hash);
      
      console.log("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        console.log("Transaction confirmed successfully!");
        console.log("Block number:", receipt.blockNumber);
        console.log("Gas used:", receipt.gasUsed.toString());
        console.log("Message sent successfully.");

        // Check for MessageReceived events
        const messageReceivedEvents = receipt.events.filter(e => e.event === 'MessageReceived');
        if (messageReceivedEvents.length > 0) {
          console.log("MessageReceived events:");
          messageReceivedEvents.forEach((event, index) => {
            console.log(`  Event ${index + 1}:`);
            console.log(`    Source EID: ${event.args.srcEid}`);
            console.log(`    Message: ${event.args.message}`);
          });
        } else {
          console.log("No MessageReceived events found on this chain.");
        }
      } else {
        console.log("Transaction failed!");
      }

      // Check the current data on the source chain
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
}

app.post("/send-message", async (req, res) => {
  try {
    const message = req.body.message;
    await main(message);
    res.send("Message sent successfully!");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Error sending message.");
  }
});

// Start the server and listen on port 3003
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});