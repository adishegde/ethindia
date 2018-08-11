pragma solidity ^0.4.21;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol";

contract Dreg is Ownable {
  mapping(bytes32 => string) registry;
  mapping(address => uint) userMapping;
  uint charge = 0.0001 ether;
  address[] userList;

  event sendName(string name);

  modifier payEther() {
    require(msg.value >= charge, "Minimum ether was not paid.");
    _;
  }

  function insert(string _num, string _name) external {
    bytes32 hashedValue = keccak256(abi.encodePacked(_num));

	  string memory _tempName = registry[hashedValue];      // needs to change
	  if (bytes(_tempName).length < bytes(_name).length) {
	    registry[hashedValue] = _name;
	  }

    // check the number of phone numbers that the user has created
    if (userMapping[msg.sender]==0){
      userList.push(msg.sender);
    }
	userMapping[msg.sender] = userMapping[msg.sender] + 1;
  }

  function getName(string _num) external payable payEther  {
    /* require(bytes(registry[keccak256(abi.encodePacked(_num))]).length>0, "Number not registered"); */
    emit sendName(registry[keccak256(abi.encodePacked(_num))]);
  }

  function setCharge(uint _charge) external onlyOwner {
    charge = _charge;
  }

  function getCharge() external view returns(uint) {
    return charge;
  }

  function getBalance() external view onlyOwner returns(uint) {
    return address(this).balance;
  }

  // give the owner the cost of calling distributeMoney, distribute the rest amongst the others
  function distributeMoney() external onlyOwner{
    owner.transfer(address(this).balance / 10);
    uint distributedValue = (address(this).balance / userList.length);
    for (uint i=0; i<userList.length; i++) {
      userList[i].transfer(distributedValue);
    }
  }
}
