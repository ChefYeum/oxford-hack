require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
// const privateKey = fs.readFileSync(".secret").toString().trim();
module.exports = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {},
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        "43c22295e7219e590e731ac1c60cbc32ed0235dc18773980a559bbb78a0aeeb9",
      ],
    },
  },
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
