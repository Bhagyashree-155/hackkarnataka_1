const hre = require("hardhat");

async function main() {
  // Get the first test account (it has 10,000 ETH)
  const [signer] = await hre.ethers.getSigners();
  
  // Replace this with YOUR MetaMask address
  // You can find it in MetaMask by clicking on your account name
  const YOUR_METAMASK_ADDRESS = process.env.METAMASK_ADDRESS || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  
  if (YOUR_METAMASK_ADDRESS === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266") {
    console.log("⚠️  Please set your MetaMask address!");
    console.log("\nUsage:");
    console.log("  $env:METAMASK_ADDRESS='YOUR_ADDRESS'; npx hardhat run scripts/fundMyAccount.js --network localhost");
    console.log("\nOr edit this script and replace YOUR_METAMASK_ADDRESS with your address.");
    console.log("\nTo find your MetaMask address:");
    console.log("  1. Open MetaMask");
    console.log("  2. Click on your account name (top)");
    console.log("  3. Copy the address (starts with 0x...)");
    return;
  }
  
  console.log(`Funding YOUR MetaMask account: ${YOUR_METAMASK_ADDRESS}`);
  console.log(`From test account: ${signer.address}`);
  
  try {
    const balanceBefore = await hre.ethers.provider.getBalance(YOUR_METAMASK_ADDRESS);
    console.log(`Your balance before: ${hre.ethers.formatEther(balanceBefore)} ETH`);

    // Send 100 ETH to your account
    const amount = hre.ethers.parseEther("100");
    console.log(`Sending ${hre.ethers.formatEther(amount)} ETH to your account...`);
    
    const tx = await signer.sendTransaction({
      to: YOUR_METAMASK_ADDRESS,
      value: amount,
    });

    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    await tx.wait();
    
    const balanceAfter = await hre.ethers.provider.getBalance(YOUR_METAMASK_ADDRESS);
    console.log(`Your balance after: ${hre.ethers.formatEther(balanceAfter)} ETH`);
    console.log("\n✅ Your MetaMask account has been funded!");
    console.log("Refresh MetaMask to see your balance.");
  } catch (error) {
    console.error("Error funding account:", error.message);
    console.log("\n⚠️  Make sure:");
    console.log("1. Hardhat node is running on http://127.0.0.1:8545");
    console.log("2. You're connected to Hardhat Local network in MetaMask");
    console.log("3. Your address is correct (starts with 0x...)");
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

