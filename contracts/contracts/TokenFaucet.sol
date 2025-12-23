// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TokenFaucet is Ownable, ReentrancyGuard, Pausable {
    FaucetToken public token;
    
    uint256 public constant CLAIM_AMOUNT = 100 * 10 ** 18; // 100 tokens
    uint256 public constant COOLDOWN_PERIOD = 1 days; // 24 hours
    uint256 public constant MAX_LIFETIME_CLAIM = 1000 * 10 ** 18; // 1000 tokens
    
    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;
    
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);
    
    constructor(address tokenAddress) Ownable(msg.sender) {
        token = FaucetToken(tokenAddress);
    }
    
    function requestTokens() external whenNotPaused nonReentrant {
        require(canClaim(msg.sender), "Cannot claim tokens");
        require(remainingAllowance(msg.sender) >= CLAIM_AMOUNT, "Lifetime limit reached");
        require(token.totalSupply() + CLAIM_AMOUNT <= token.MAX_SUPPLY(), "Faucet depleted");
        
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += CLAIM_AMOUNT;
        
        token.mint(msg.sender, CLAIM_AMOUNT);
        
        emit TokensClaimed(msg.sender, CLAIM_AMOUNT, block.timestamp);
    }
    
    function canClaim(address user) public view returns (bool) {
        if (paused()) return false;
        if (totalClaimed[user] >= MAX_LIFETIME_CLAIM) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_PERIOD) return false;
        return true;
    }
    
    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_LIFETIME_CLAIM) {
            return 0;
        }
        return MAX_LIFETIME_CLAIM - totalClaimed[user];
    }
    
    function setPaused(bool _paused) external onlyOwner {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
        emit FaucetPaused(_paused);
    }
    
    function getClaimStatus(address user) external view returns (
        bool canClaimNow,
        uint256 nextClaimTime,
        uint256 remaining
    ) {
        canClaimNow = canClaim(user);
        nextClaimTime = lastClaimAt[user] + COOLDOWN_PERIOD;
        remaining = remainingAllowance(user);
    }
}