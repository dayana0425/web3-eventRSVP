import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.INFURA_URL_MUMBAI,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000,
    }
  }
};

export default config;
