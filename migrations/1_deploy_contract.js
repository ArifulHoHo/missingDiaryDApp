// requiring the contract
var MissingDiary = artifacts.require("./missingDiary.sol");

// exporting as module
module.exports = function(deployer) {

  const deployerAddress = "0x377A0953C9B25f5278041b2C0AFcF3f9E97e5C49";  // hard coded deployer address so this address is the admin address
  deployer.deploy(MissingDiary, {from : deployerAddress});
};
