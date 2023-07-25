// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (access/AccessControl.sol)

pragma solidity ^0.8.0;
import "./IMasterAccess.sol";


/**
 * @dev Contract module to restore the status of the address
 * specifically, whether this address has been assigned to any role or not.
 * ```
 * usage:  contract B is AccessControl, MasterAccess
 * ```
 */

abstract contract MasterAccess is IMasterAccess {
    mapping(address => bool) private _role_store;

    /**
     * @dev when storing a certain address, set the role_store status to true.
     *  The function shall be called by role application function when grant a new role
     * to some account
     */
     function setRole(address account) public virtual override {
        require(!_role_store[account],"ROLE STATUS ALREADY SET");
       _role_store[account] = true;
     }
     
     /**
     * @dev when application role contract revoke the role, this function
     * shall be called.
     */
     function unsetRole(address account) public virtual override {
        require(_role_store[account],"ROLE STATUS NOT SET");
       _role_store[account] = false;
     }

     function retrieveRoleStatus(address account) public view virtual override returns (bool){
        return _role_store[account];
     }
    



}