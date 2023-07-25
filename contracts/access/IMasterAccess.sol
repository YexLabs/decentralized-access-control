// SPDX-License-Identifier: MIT
// // Yex Lab Contract v1.0.0

pragma solidity ^0.8.0;

/**
 * @dev External interface of MasterAccess contract
 */

 interface IMasterAccess {
    
    //set the role status to be true when the application role contract grant a new role
    function setRole(address account) external;

    //unset the role status to be false when the application role contract revoke a role
    function unsetRole(address account) external;
    
    //for application role contract to retrieve the role status and make the decision
    function retrieveRoleStatus(address account) external view returns (bool);



 }