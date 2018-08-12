pragma solidity ^0.4.21;

import "https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol";

contract Dreg is Ownable {
  // mapping between the hash of a number and the corresponding name
  mapping(bytes32 => string) registry;
  // mapping between user and their number of contributions
  mapping(address => uint) userMapping;
  // mapping to check the last month a user had last taken his/her reward
  mapping(address => uint) monthlyWithdrawal;
  // Charge for each query.
  uint charge = 0.1 ether;

  // One month time period
  /* uint period = 28 * 86400; */
  uint period = 1; // For development we use a time period of 1 second

  // stores the previous time to keep a count of the month
  uint previousMonthTime = now;
  // stores the current month
  uint latestMonthNumber = 1;
  // amount to be distributed in a particular period to all the users
  uint distributedAmount;
  // list of all the contributers
  address[] userList;

  event sendName(string name);

  // Ensures that a user who wants to query a number pays a minimum charge
  modifier payEther() {
    require(msg.value >= charge, "Minimum ether was not paid.");
    _;
  }

  /*  The modifier checks if the function has been called after a given period,
      if yes then reset the previousMonthTime to the new value, increase the latestMonthNumber(month counter)
      and calculate the distributed amout for each user for the next period(usually 28 days)
      */
  modifier changeMonth() {
    if (now > previousMonthTime + period) {
      previousMonthTime = previousMonthTime + ((now - previousMonthTime)/period) * period;
      latestMonthNumber++;
      distributedAmount = (address(this).balance / userList.length);
    }
    _;
  }

   /* The function is called when a user wants to  insert a new data to the smart contracts
      The number is hashed and mapped to the name provided by the user.
      If the number is already present in the map then we decide to replace it on the basis of the length of the string
      We also insert the new user to the contributers map
   */
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

  // the following function gets called when a user does a query for a number
  function getName(string _num) external payable payEther  {
    emit sendName(registry[keccak256(abi.encodePacked(_num))]);
  }

  // There exists an owner who sets the charge for the getName function
  function setCharge(uint _charge) external onlyOwner {
    charge = _charge;
  }

  function getCharge() external view returns(uint) {
    return charge;
  }

  function getBalance() external view onlyOwner returns(uint) {
    return address(this).balance;
  }

   /* The following function gives rewards to the users who are contributing to the data pool of the smart contract.
     The first require statement ensures that only those users who have contributed can get the reward
     The second require statement ensures that a contributer can get the reward only once in a given period(28 days here)
   */
  function getMoney() external payable changeMonth() {
    require(userMapping[msg.sender] != 0, "To get rewards kindly contribute to DReg");
    require(monthlyWithdrawal[msg.sender] != latestMonthNumber, "Already withdrew the reward for current month");
    monthlyWithdrawal[msg.sender] = latestMonthNumber;
    msg.sender.send(distributedAmount);
  }
}
