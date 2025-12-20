// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourToken is ERC20 {
    address public minter;
    // Fixed maximum supply defined at deployment
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; 

    constructor() ERC20("GPP Faucet Token", "GFT") {
        minter = msg.sender;
    }

    // Role management to allow the Faucet to mint
    function setMinter(address _faucet) external {
        require(msg.sender == minter, "Only current minter can change minter");
        minter = _faucet;
    }

    // Only the faucet contract can mint new tokens
    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "Only faucet can mint");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}