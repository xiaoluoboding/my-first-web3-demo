import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

describe('Token contract', function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory('Token')

    /**
     * A Signer in ethers.js is an object that represents an Ethereum account.
     * It's used to send transactions to contracts and other accounts.
     * Here we're getting a list of the accounts in the node we're connected to,
     * which in this case is Hardhat Network, and we're only keeping the first one.
     * https://docs.ethers.org/v5/api/signer/
     */
    const [owner, addr1, addr2] = await ethers.getSigners()

    const hardhatToken = await Token.deploy()

    await hardhatToken.deployed()

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, owner, addr1, addr2 }
  }

  // You can nest describe calls to create subsections.
  describe('Deployment', function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it('Should set the right owner', async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.owner()).to.equal(owner.address)
    })

    it('Should assign the total supply of tokens to the owner', async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
      const ownerBalance = await hardhatToken.balanceOf(owner.address)
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      )
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50)
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50)

      // Transfer 50 tokens from owner to addr1
      await expect(() =>
        hardhatToken.transfer(addr1.address, 50)
      ).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50])

      // Transfer 50 tokens from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, 50)
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50)

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(() =>
        hardhatToken.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50])
    })

    it('should emit Transfer events', async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      )

      // Transfer 50 tokens from owner to addr1
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, 'Transfer')
        .withArgs(owner.address, addr1.address, 50)

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, 'Transfer')
        .withArgs(addr1.address, addr2.address, 50)
    })

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      )
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address)

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith('Not enough tokens')

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      )
    })
  })
})
