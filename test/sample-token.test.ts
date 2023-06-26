const chai = require('chai');
const { ethers } = require('hardhat');

const { expect } = chai

const baseUri = 'ipfs://theBaseUri/'

describe('SampleToken', () => {
  const getInstance = async (uri = baseUri) => {
    const [owner, alice, bob, chris] = await ethers.getSigners()

    const instance = await ethers.deployContract('SampleToken', ['SampleToken', 'STKN', uri])

    return { instance, owner, alice, bob, chris };
  }

  describe('Mint', () => {
    it('Should mint an nft to the given address with tokenId 1', async () => {
      const { instance, owner, bob } = await getInstance()

      const tx = await instance.connect(owner).mint(bob.address)
      await tx.wait()

      expect(await instance.ownerOf(1)).to.equal(bob.address)
    });

    it('Should not allow to mint more than the totalSupply', async () => {
      const { instance, owner, bob, chris } = await getInstance()

      const promises = []
      for (let i = 0; i < 10; i++) {
        const tx = await instance.connect(owner).mint(bob.address)
        promises.push(tx.wait())
      }

      await Promise.all(promises)

      // mint 11 should fail
      await expect(instance.connect(owner).mint(chris.address)).to.be.revertedWith('Already reached the maximum amount of NFTs')
    });

    it('Should allow only the owner to mint an nft', async () => {
      const { instance, alice, bob } = await getInstance()

      await expect(instance.connect(alice).mint(bob.address)).to.be.revertedWith('Ownable: caller is not the owner')
    });
  })

  describe('URI', () => {
    it('Should return expected token uri', async () => {
      const { instance, owner, alice } = await getInstance()

      const tx1 = await instance.connect(owner).mint(alice.address)
      await tx1.wait()

      const actual = await instance.tokenURI(1)
      expect(actual).to.equal(`${baseUri}1`)
    });

    it('Should allow to change the base uri', async () => {
      const newUri = 'ipfs://myUri/'
      const { instance, owner, alice } = await getInstance()

      const tx1 = await instance.connect(owner).mint(alice.address)
      await tx1.wait()

      const actual = await instance.tokenURI(1)
      expect(actual).to.equal(`${baseUri}1`)

      const tx2 = await instance.connect(owner).setBaseURI(newUri)
      await tx2.wait()

      const actual2 = await instance.tokenURI(1)
      expect(actual2).to.equal(`${newUri}1`)
    });

    it('Should allow only the owner to change the base uri', async () => {
      const { instance, alice } = await getInstance()

      await expect(instance.connect(alice).setBaseURI('ipfs://myUri/')).to.be.revertedWith('Ownable: caller is not the owner')
    });
  });
});
