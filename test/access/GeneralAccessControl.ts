import {
    loadFixture
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("GeneralAccessControl", function () {

    async function deployMasterAccessControlFixture() {
        const MasterAccess = await ethers.getContractFactory("MasterAccess");
        const masterAccess = await MasterAccess.deploy();
        return { masterAccess };
    }
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployAccessControlFixture() {

        const masterAccess = await deployMasterAccessControlFixture();
        const masterAccessAddr = await masterAccess.masterAccess.getAddress();
        // Contracts are deployed using the first signer/account by default
        const accounts = await ethers.getSigners();

        const GeneralAccessControl = await ethers.getContractFactory("GeneralAccessControl");
        const generalAccessControl = await GeneralAccessControl.deploy(masterAccessAddr);

        return { generalAccessControl, masterAccessAddr, accounts };
    }

    describe("Deployment", function () {
        it("Should set the right masterAccess", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);
            expect(await generalAccessControl.masterAccess()).to.equal(masterAccessAddr);
        });
    });
    describe("GrantRole", function () {
        it("Should fail if try to grant role when exceeds role capacity", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);
            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 1);
            // grant role for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role for account2
            const account2 = accounts[2];
            await expect(generalAccessControl.grantRole(role1, account2.address)).to.be.revertedWith('CAPACITY OVERFLOW');
        });

        it("Should fail if try to grant 2 role for one person", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 1);
            const role2 = ethers.keccak256(ethers.encodeBytes32String('ROLE2'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role2, 1);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role2 for account1
            await expect(generalAccessControl.grantRole(role2, account1.address)).to.be.revertedWith('account have been grant some role');
        });

        it("Should fail if no one approve", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);


            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role1 for account2
            const account2 = accounts[2];
            await generalAccessControl.grantRole(role1, account2.address);
            expect(await generalAccessControl.hasRole(role1, account2.address)).to.equal(true);

            // grant role1 for account3 will fail since no one approve
            const account3 = accounts[3];
            await expect(generalAccessControl.grantRole(role1, account3.address)).to.be.reverted;

        });

        it("Should success if exceeds 1/2 accounts approve", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);


            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role1 for account2
            const account2 = accounts[2];
            await generalAccessControl.grantRole(role1, account2.address);
            expect(await generalAccessControl.hasRole(role1, account2.address)).to.equal(true);

            // grant role1 for account3 will fail since no one approve
            const account3 = accounts[3];
            await expect(generalAccessControl.grantRole(role1, account3.address)).to.be.reverted;

            // account2 approve grant role for account3
            await generalAccessControl.connect(account2).approveRole(role1, account3.address, true);

            await generalAccessControl.grantRole(role1, account3.address);
            expect(await generalAccessControl.hasRole(role1, account3.address)).to.equal(true);
        });
    });

    describe("RevokeRole", function () {
        it("Should success if only one account for one role", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // revoke role
            await generalAccessControl.revokeRole(role1, account1.address);

        });
        it("Should fail if no one reject", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role1 for account2
            const account2 = accounts[2];
            await generalAccessControl.grantRole(role1, account2.address);
            expect(await generalAccessControl.hasRole(role1, account2.address)).to.equal(true);

            // revoke role fail since no one reject
            await expect(generalAccessControl.revokeRole(role1, account1.address)).to.be.rejected;

        });
        it("Should success if exceeds 1/2 accounts reject", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // grant role1 for account2
            const account2 = accounts[2];
            await generalAccessControl.grantRole(role1, account2.address);
            expect(await generalAccessControl.hasRole(role1, account2.address)).to.equal(true);

            // account2 reject pass
            await generalAccessControl.connect(account2).rejectRole(role1, account1.address, true);

            // revoke role fail since no one reject
            await generalAccessControl.revokeRole(role1, account1.address);

            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(false);

        });
    });

    describe("RenounceRole", function () {
        it("Should fail if renounce not by self", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // renounce role
            await expect(generalAccessControl.renounceRole(role1, account1.address)).to.be.reverted;

        });
        it("Should success if renounce by self", async function () {
            const { generalAccessControl, masterAccessAddr, accounts } = await loadFixture(deployAccessControlFixture);

            const role1 = ethers.keccak256(ethers.encodeBytes32String('ROLE1'));
            // init role capacity
            await generalAccessControl.setRoleMaximum(role1, 4);

            // grant role1 for account1
            const account1 = accounts[1];
            await generalAccessControl.grantRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(true);

            // renounce role
            await generalAccessControl.connect(account1).renounceRole(role1, account1.address);
            expect(await generalAccessControl.hasRole(role1, account1.address)).to.equal(false);

        });
    });
});
