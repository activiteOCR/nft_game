// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract bbbearsToken is ERC721, Ownable {
    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    uint256 COUNTER;

    uint256 fee = 1 ether;

    struct Bear {
        string name;
        uint256 id;
        uint256 dna;
        uint8 level;
        uint8 rarity;
    }

    Bear[] public bears;

    event NewBear(address indexed owner, uint256 id, uint256 dna);

    // Helpers
    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod;
    }

    function updateFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function withdraw() external payable onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    // Creation
    function _createBBBears(string memory _name) internal {
        uint8 randRarity = uint8(_createRandomNum(100));
        uint256 randDna = _createRandomNum(10**16);
        Bear memory newBear = Bear(_name, COUNTER, randDna, 1, randRarity); 
        bears.push(newBear);
        _safeMint(msg.sender, COUNTER);
        emit NewBear(msg.sender, COUNTER, randDna );
        COUNTER++;
    }

    function createRandomBBBears(string memory _name) public payable{
        require(msg.value >= fee);
        _createBBBears(_name);
    }

    // Getters
    function getBBBears() public view returns(Bear[] memory){
        return bears;
    }

    function getOwnerBBBears(address _owner) public view returns (Bear[] memory) {
    Bear[] memory result = new Bear[](balanceOf(_owner));
    uint256 counter = 0;
    for (uint256 i = 0; i < bears.length; i++) {
      if (ownerOf(i) == _owner) {
        result[counter] = bears[i];
        counter++;
      }
    }
    return result;
  }

  // Actions
  function levelUp(uint256 _bearId) public {
    require(ownerOf(_bearId) == msg.sender);
    Bear storage bear = bears[_bearId];
    bear.level++;
  }
}