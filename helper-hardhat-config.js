const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "hardhat",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        callbackGasLimit: "500000",
        interval: "30",
    },

    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x8103B0A8A0	0be2DDC778e6e7eaa21791Cd364625",
        entranceFee: ethers.parseEther("0.01"),
        gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
        subscriptionId: "6328",
        callbackGasLimit: "500000",
        interval: "30",
    },
}

const developmentChains = ["hardhat", "localhost"]

const INITIAL_SUPPLY = "1000000000000000000000000"

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
}
