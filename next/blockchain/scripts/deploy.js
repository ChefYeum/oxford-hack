const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // We get the contract to deploy
  const Payable = await ethers.getContractFactory("Payable");
  const payable = await Payable.deploy();
  await payable.deployed();
  console.log("payable deployed to:", payable.address);

  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // console.log("Greeter deployed to:", greeter.address);
  let config = `
  export const payableAddress = "${payable.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync("config.js", JSON.parse(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
