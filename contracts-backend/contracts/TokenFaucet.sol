// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";

contract TokenFaucet {
    YourToken public token; // This now recognizes YourToken from the import
    address public admin;
    bool public paused;

    // Constants required by GPP
    uint256 public constant FAUCET_AMOUNT = 10 * 10**18; 
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 100 * 10**18;

    // Permanent storage mappings required
    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    // Required events
    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address _tokenAddress) {
        token = YourToken(_tokenAddress);
        admin = msg.sender;
        paused = false;
    }

    // Main claim function with mandatory revert conditions
    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cooldown period not elapsed");
        require(totalClaimed[msg.sender] + FAUCET_AMOUNT <= MAX_CLAIM_AMOUNT, "Lifetime claim limit reached");

        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        token.mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    // Returns boolean indicating if address can currently claim
    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (totalClaimed[user] + FAUCET_AMOUNT > MAX_CLAIM_AMOUNT) return false;
        return (block.timestamp >= lastClaimAt[user] + COOLDOWN_TIME);
    }

    // Returns how many tokens address can still claim in lifetime
    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() public view returns (bool) {
        return paused;
    }
}