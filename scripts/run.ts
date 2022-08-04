import { ethers } from "hardhat"; // This plugin brings to Hardhat the Ethereum library ethers.js

async function main() {
    try {
        const rsvpContractFactory = await ethers.getContractFactory("Web3RSVP");
        const rsvpContract = await rsvpContractFactory.deploy();
        await rsvpContract.deployed();
        console.log("Contract deployed to:", rsvpContract.address);
    } catch (error) {
        console.log("Failed Deploying Smart Contract to Mumbai Testnet.")
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});