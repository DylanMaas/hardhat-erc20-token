const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains, INITIAL_SUPPLY } = require("../../helper-hardhat-config") // depends on level in test script?

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("OurToken Unit Tests", function () {
          const multiplier = 10 ** 18
          let ourToken, signer, user1

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              signer = accounts[0]
              user1 = accounts[1]
              await deployments.fixture(["all"])

              const ourTokenDeployment = await deployments.get("OurToken")
              ourToken = await ethers.getContractAt(
                  ourTokenDeployment.abi,
                  ourTokenDeployment.address,
                  signer,
              )
          })
          it("was deployed", async () => {
              assert(ourToken.target)
              // if not, check with target
          })

          describe("constructor", function () {
              it("should have correct initial supply of token", async () => {
                  const totalSupply = await ourToken.totalSupply()
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
              })
              it("initializes the token with the correct name and symbol", async () => {
                  const name = (await ourToken.name()).toString()
                  assert.equal(name, "OurToken")

                  const symbol = (await ourToken.symbol()).toString()
                  assert.equal(symbol, "OT")
              })
          })

          describe("transfers", function () {
              it("Should be able to transfer tokens succesfully to another address", async () => {
                  const tokensToSend = ethers.parseEther("10")
                  await ourToken.transfer(user1, tokensToSend)
                  expect(await ourToken.balanceOf(user1)).to.equal(tokensToSend)
              })
              it("Emits a transfer event, when a transfer occurs", async () => {
                  await expect(ourToken.transfer(user1, (10 * multiplier).toString())).to.emit(
                      ourToken,
                      "Transfer",
                  )
              })
          })

          describe("allowances", function () {
              const amount = (20 * multiplier).toString()
              beforeEach(async () => {
                  const playerTokenDeployment = await deployments.get("OurToken")
                  playerToken = await ethers.getContractAt(
                      playerTokenDeployment.abi,
                      playerTokenDeployment.address,
                      user1,
                  )
              })
              it("Should approve other address to spend tokens", async () => {
                  tokensToSpend = ethers.parseEther("5")
                  // deployer is approving that user1 can spend 5 of their OTs
                  await ourToken.approve(user1, tokensToSpend)
                  await playerToken.transferFrom(signer, user1, tokensToSpend)
                  expect(await ourToken.balanceOf(user1)).to.equal(tokensToSpend)
              })
              it("Should not approve an unapproved person to do transfers", async () => {
                  await expect(
                      playerToken.transferFrom(signer, user1, amount),
                  ).to.be.revertedWithCustomError(ourToken, "ERC20InsufficientAllowance")
              })
              it("Emits an approval event, when an approval occurs", async () => {
                  await expect(ourToken.approve(user1, amount)).to.emit(ourToken, "Approval")
              })
              it("The allowance being set is accurate", async () => {
                  await ourToken.approve(user1, amount)
                  const allowance = await ourToken.allowance(signer, user1)
                  assert.equal(allowance.toString(), amount)
              })
              it("Won't allow a user to go over the allowance", async () => {
                  await ourToken.approve(user1, amount)
                  await expect(
                      playerToken.transferFrom(signer, user1, (40 * multiplier).toString()),
                  ).to.be.revertedWithCustomError(ourToken, "ERC20InsufficientAllowance")
              })
          })
      })
