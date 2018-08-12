pragma solidity ^0.4.21;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol";

contract Dreg is Ownable {
  mapping(bytes32 => string) registry;
  mapping(address => uint) userMapping;
  mapping(address => uint) monthlyWithdrawal;
  uint charge = 0.0001 ether;
  uint period = 28 * 86400;
  uint previousMonthTime = now;
  uint latestMonthNumber = 1;
  uint distributedAmount;
  address[] userList;

  event sendName(string name);

  modifier payEther() {
    require(msg.value >= charge, "Minimum ether was not paid.");
    _;
  }

  modifier changeMonth() {
    if (now > previousMonthTime + period) {
      previousMonthTime = previousMonthTime + ((now - previousMonthTime)/period) * period;
      latestMonthNumber++;
      distributedAmount = (address(this).balance / userList.length);
    }
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
    /* emit sendName("ABC"); */
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
  function getMoney() external changeMonth() {
    require(monthlyWithdrawal[msg.sender] != latestMonthNumber, "Already withdrew the reward for current month");
    monthlyWithdrawal[msg.sender] = latestMonthNumber;
    (msg.sender).transfer(distributedAmount);
  }
}
