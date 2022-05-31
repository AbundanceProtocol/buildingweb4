const hre = require("hardhat");
const fs = require('fs');


async function main() {
  const Abundance = await hre.ethers.getContractFactory("Abundance");
  const abundance = await Abundance.deploy(0);
  await abundance.deployed();
  console.log("Contract deployed to:", abundance.address);

  fs.writeFileSync('./config.js', `
  export const contractAddress = "${abundance.address}"
  export const ownerAddress = "${abundance.signer.address}"
  export const fullContract = "${abundance}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
