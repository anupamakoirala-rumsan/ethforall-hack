

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.8.10",
    settings:{
        optimizer:{
          enabled:false,
          runs:50
        }
    }
  },
  mocha: {
    timeout: 40000
  }

};
