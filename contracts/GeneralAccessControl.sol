// SPDX-License-Identifier: MIT
// Yex Lab Contract v1.0.0

pragma solidity ^0.8.0;
import "./access/DecentralizedAccessControl.sol";
import "./access/MasterAccess.sol";

contract GeneralAccessControl is DecentralizedAccessControl {
    MasterAccess public masterAccess;

    constructor(address _masterAccess) {
        masterAccess = MasterAccess(_masterAccess);
        super._grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) public override {
        require(
            masterAccess.retrieveRoleStatus(account) == false,
            "account have been grant some role"
        );
        super.grantRole(role, account);
        masterAccess.setRole(account);
    }

    /**
     * @dev approve the certain `account` to have the `role`.
     *
     * Requirements:
     *
     * - the caller must have ``role`` identity.
     */
    function approveRole(
        bytes32 role,
        address account,
        bool support
    ) public override {
        require(
            masterAccess.retrieveRoleStatus(account) == false,
            "account have been grant some role"
        );
        super.approveRole(role, account, support);
    }

    /**
     * @dev role members support to revoke the account to be the role member`.
     *
     * Requirements:
     *
     * - the caller must have ``role`` identity.
     */
    function rejectRole(
        bytes32 role,
        address account,
        bool support
    ) public override {
        require(
            masterAccess.retrieveRoleStatus(account) == true,
            "account have not been grant some role"
        );
        super.rejectRole(role, account, support);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) public override {
        require(
            masterAccess.retrieveRoleStatus(account) == true,
            "account have not granted any role"
        );
        super.revokeRole(role, account);
        masterAccess.unsetRole(account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) public override {
        require(
            masterAccess.retrieveRoleStatus(account) == true,
            "account have not granted any role"
        );
        super.renounceRole(role, account);
        masterAccess.unsetRole(account);
    }
}
