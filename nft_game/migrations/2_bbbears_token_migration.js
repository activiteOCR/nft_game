const bbbearsToken = artifacts.require("bbbearsToken");

module.exports = function (deployer) {
  deployer.deploy(bbbearsToken, "bbbearsToken", "BBBT");
};