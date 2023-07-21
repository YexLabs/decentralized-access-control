# decentralized-access-control

[This project](https://github.com/yexlab/decentralized-access-control) follows the path of the [OpenZeppelin access control ](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) and make it much safer and decentralized for the web3 application developer

## Rationale

The original OpenZeppelin access control demonstrates a good way to manage the user access based on role management. but it leaves some loopholes. 

- The adding and removal of the role solely relies on the role admin, which is a centralized point. The other contracts that use the original OpenZeppelin access control contract would suffer bad consequences if the role admin adds or removes the role based on their own will and is detrimental to their platform.

- The original OpenZeppelin access control would allow the role admin to add as many members as they want. This may not necessarily be a good thing. One of the bad consequences is having too many members which leads to an inefficient and unresponsive role-based decision


## How we address the problem?

- The new mechanism in this repo would disallow the role of admin from being the centralized point to make decisions for adding or removing role members. Instead, this contract would promote the participation of other role members in the decision-making process of adding or removing role members.

- this repo would allow the role admin to set up the capacity to address the issue of inefficient and unresponsive role-based decision


## How to check all members belong to the role?

For gas optimization purposes, on-chain data only records whether the role exists or not (with mapping data structure). The users of the decentralized access control can use tools like the graph to listen to the on-chain event and save the role member data in their database.



