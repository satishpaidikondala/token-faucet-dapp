const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TokenFaucet", function () {
  let token, faucet;
  let owner, user1, user2;
  
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const Token = await ethers.getContractFactory("FaucetToken");
    token = await Token.deploy();
    await token.waitForDeployment();
    
    const Faucet = await ethers.getContractFactory("TokenFaucet");
    faucet = await Faucet.deploy(await token.getAddress());
    await faucet.waitForDeployment();
    
    // Grant minter role to faucet
    await token.grantRole(await token.MINTER_ROLE(), await faucet.getAddress());
  });
  
  describe("Deployment", function () {
    it("Should deploy token with correct name and symbol", async function () {
      expect(await token.name()).to.equal("FaucetToken");
      expect(await token.symbol()).to.equal("FCT");
    });
    
    it("Should deploy faucet with correct token address", async function () {
      expect(await faucet.token()).to.equal(await token.getAddress());
    });
  });
  
  describe("Token Claim", function () {
    it("Should allow user to claim tokens", async function () {
      await expect(faucet.connect(user1).requestTokens())
        .to.emit(faucet, "TokensClaimed")
        .withArgs(user1.address, 100n * 10n ** 18n, expect.any(BigInt));
      
      expect(await token.balanceOf(user1.address)).to.equal(100n * 10n ** 18n);
      expect(await faucet.totalClaimed(user1.address)).to.equal(100n * 10n ** 18n);
    });
    
    it("Should enforce cooldown period", async function () {
      await faucet.connect(user1).requestTokens();
      
      await expect(faucet.connect(user1).requestTokens())
        .to.be.revertedWith("Cannot claim tokens");
      
      // Fast forward 23 hours
      await time.increase(23 * 3600);
      
      await expect(faucet.connect(user1).requestTokens())
        .to.be.revertedWith("Cannot claim tokens");
      
      // Fast forward 1 more hour
      await time.increase(3600);
      
      await expect(faucet.connect(user1).requestTokens())
        .to.not.be.reverted;
    });
    
    it("Should enforce lifetime limit", async function () {
      // First claim
      await faucet.connect(user1).requestTokens();
      
      // Fast forward 24 hours
      await time.increase(24 * 3600);
      
      // Make 9 more claims (total 10)
      for (let i = 0; i < 9; i++) {
        await faucet.connect(user1).requestTokens();
        await time.increase(24 * 3600);
      }
      
      // Try 11th claim (should fail)
      await expect(faucet.connect(user1).requestTokens())
        .to.be.revertedWith("Lifetime limit reached");
    });
  });
  
  describe("Pause Functionality", function () {
    it("Should allow owner to pause and unpause", async function () {
      await expect(faucet.connect(owner).setPaused(true))
        .to.emit(faucet, "FaucetPaused")
        .withArgs(true);
      
      expect(await faucet.paused()).to.be.true;
      
      await expect(faucet.connect(user1).requestTokens())
        .to.be.revertedWithCustomError(faucet, "EnforcedPause");
      
      await expect(faucet.connect(owner).setPaused(false))
        .to.emit(faucet, "FaucetPaused")
        .withArgs(false);
      
      expect(await faucet.paused()).to.be.false;
    });
    
    it("Should not allow non-owner to pause", async function () {
      await expect(faucet.connect(user1).setPaused(true))
        .to.be.revertedWithCustomError(faucet, "OwnableUnauthorizedAccount");
    });
  });
  
  describe("View Functions", function () {
    it("Should return correct claim status", async function () {
      const status = await faucet.getClaimStatus(user1.address);
      expect(status[0]).to.be.true; // canClaimNow
      expect(status[2]).to.equal(1000n * 10n ** 18n); // remaining allowance
    });
    
    it("Should return correct remaining allowance", async function () {
      expect(await faucet.remainingAllowance(user1.address))
        .to.equal(1000n * 10n ** 18n);
    });
  });
});