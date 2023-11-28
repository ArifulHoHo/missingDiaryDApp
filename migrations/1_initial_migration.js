var missingDiary = artifacts.require("./missingDiary.sol");

module.exports = function(deployer) {
  deployer.deploy(missingDiary);
};
