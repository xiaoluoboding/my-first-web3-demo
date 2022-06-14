import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Counter', function () {
  it("Should return the new counts once it's changed", async function () {
    const Counter = await ethers.getContractFactory('Counter')
    const counter = await Counter.deploy()
    await counter.deployed()

    expect(await counter.getCounts()).to.equal(0)

    await counter.increment()

    expect(await counter.getCounts()).to.equal(1)

    await counter.increment()
    await counter.increment()
    await counter.increment()
    await counter.increment()

    expect(await counter.getCounts()).to.equal(5)
  })
})
