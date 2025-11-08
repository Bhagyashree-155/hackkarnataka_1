const hre = require("hardhat");

async function main() {
  const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  console.log("Triggering a transaction to refresh MetaMask...");
  console.log("Address:", address);
  console.log("");
  
  try {
    const [signer] = await hre.ethers.getSigners();
    const balance = await hre.ethers.provider.getBalance(address);
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    
    console.log(`Current block: ${blockNumber}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("");
    
    // Send a small transaction to trigger block mining
    console.log("Sending a small transaction to trigger block mining...");
    const tx = await signer.sendTransaction({
      to: address,
      value: hre.ethers.parseEther("0.0001"),
    });
    
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    
    const newBlockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`New block number: ${newBlockNumber}`);
    console.log("");
    console.log("✅ Transaction confirmed!");
    console.log("");
    console.log("Now in MetaMask:");
    console.log("1. Make sure you're on 'Hardhat Local' network");
    console.log("2. Refresh the page (F5 or Ctrl+R)");
    console.log("3. Or disconnect and reconnect your wallet");
    console.log("4. You should now see your ETH balance!");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

