pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Dreg is ownable {
  mapping(bytes32 => name) registry;
  mapping(address => uint) userMapping;
  uint charge = 0.0001 ether;
  address[] userList;

  modifier payEther() {
    require(msg.value == charge, "Minimum ether was not paid.");
    _;
  }

  function insert(string _num, string _name) external {
    bytes32 hashedValue = keccak256(_num);
    if (registry[hashedValue].isValue) {
      string _tempName = registry[keccak256(_num)];
      // needs to change
      if (_tempName.length < _name.length) {
        registry[hashedValue] = _name;
      }
    } else {
      registry[hashedValue] = _name;
    }

    // check the number of phone numbers that the user has created
    if (!userMapping[msg.sender].isValue){
      userMapping[msg.sender]  = 1;
      userList.push(msg.sender);
    } else {
      userMapping[msg.sender] = userMapping[msg.sender] + 1;
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

  function getBalance() external view onlyOwner return(uint) {
    return this.balance;
  }

  // give the owner the cost of calling distributeMoney, distribute the rest amongst the others
  function distributeMoney() external onlyOwner{
    owner.transfer(this.balance * 0.1);
    uint distributedValue = (this.balance / userList.length);
    for (uint i=0; i<userList.length; i++) {
      userList[i].transfer(distributedValue);
    }
  }
}
