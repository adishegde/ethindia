pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Dreg is ownable {
  mapping(bytes32 => name) registry;
  mapping(address => bool) users;
  unit charge = 0.0001 ether;

  modifier payEther() {
    require(msg.value == charge, "Minimum ether was not paid.");
    _;
  }

  function insert(string _num, string _name) external {
    if (registry[keccak256(_num)].isValue) {
      string _tempName = registry[keccak256(_num)];
      // needs to change
      if (_tempName.length < _name.length) {
        registry[keccak256(_num)] = _name;
      }
    } else {
      registry[keccak256(_num)] = _name;
    }
  }

  function getName(string _num) external view payable payEther returns(string) {
    require(registry[keccak256(_num)].isValue, "Number not registered");
    return registry[keccak(_num)];
  }

  function setCharge(uint _charge) external onlyOwner {
    charge = _charge;
  }

  function getCharge() external view returns(uint) {
    return charge;
  }

  function distributeMoney() external onlyOwner{

  }
}
