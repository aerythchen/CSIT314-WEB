const { db } = require('../database');

class ViewUserAccountEntity {
    constructor() {
        this.accounts = [];
        this.selectedAccount = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewUserAccountEntity: Initializing...");
        this.accounts = [];
        this.selectedAccount = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewUserAccountEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validActions = ["getAll", "getById"];
        if (!data.action || !validActions.includes(data.action)) {
            return { isValid: false, error: "Valid action is required (getAll or getById)" };
        }

        if (data.action === "getById") {
            if (!data.accountId || typeof data.accountId !== 'string') {
                return { isValid: false, error: "Valid account ID is required for getById action" };
            }
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewUserAccountEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        if (data.action === "getAll") {
            // Get all active accounts from database
            this.accounts = db.find('userAccounts', { isDeleted: false });
            this.selectedAccount = null;
            
            console.log(`Fetched ${this.accounts.length} accounts`);
            return {
                success: true,
                message: "Accounts retrieved",
                count: this.accounts.length
            };
        }
        
        if (data.action === "getById") {
            // Get specific account from database
            this.selectedAccount = db.findById('userAccounts', data.accountId);
            this.accounts = [];
            
            if (!this.selectedAccount || this.selectedAccount.isDeleted) {
                this.selectedAccount = null;
                return {
                    success: false,
                    error: `Account with ID ${data.accountId} not found`
                };
            }
            
            console.log(`Account found: ${this.selectedAccount.username}`);
            return {
                success: true,
                message: "Account retrieved"
            };
        }

        return {
            success: false,
            error: "Unknown action"
        };
    }

    getData() {
        console.log("ViewUserAccountEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        if (this.selectedAccount === null && this.accounts !== null) {
            return {
                success: true,
                data: {
                    accounts: this.accounts,
                    count: this.accounts.length
                }
            };
        }

        return {
            success: true,
            data: {
                account: this.selectedAccount,
                accounts: []
            }
        };
    }
}

module.exports = ViewUserAccountEntity;
