const { networkConfig, developmentChains, INITIAL_SUPPLY } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [INITIAL_SUPPLY]
    // constructor variables

    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`ourToken deployed at ${ourToken.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(ourToken.address, args)
    }
    log("------------------------------------------------")
}

module.exports.tags = ["all", "ourToken"]
