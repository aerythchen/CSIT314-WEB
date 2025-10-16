const ViewUserAccountEntity = require('../entity/UserAdmin');

class ViewUserAccountController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    viewUserAccount(data) {
        console.log("ViewUserAccountController: Processing view account request...");
        
        if (!accountId || accountId.trim() === "") {
            return {
                success: false,
                error: "Account ID is required",
                account: null
            };
        }
        
        return this.processViewRequest(accountId);
    }

    getAllUserAccounts() {
        console.log("ViewUserAccountController: Processing get all accounts request...");
        
        const entityResult = this.entity.process({
            action: "getAll"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                accounts: []
            };
        }
        
        const accountsData = this.entity.getData();
        
        console.log(`Retrieved ${accountsData.data.accounts.length} accounts`);
        
        return {
            success: true,
            accounts: accountsData.data.accounts,
            count: accountsData.data.count
        };
    }

    processViewRequest(accountId) {
        console.log(`Processing view request for account: ${accountId}...`);
        
        const entityResult = this.entity.process({
            action: "getById",
            accountId: accountId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                account: null
            };
        }
        
        const accountData = this.entity.getData();
        
        if (!accountData.data.account) {
            return {
                success: false,
                error: "Account not found",
                account: null
            };
        }
        
        console.log(`Account retrieved: ${accountData.data.account.username}`);
        
        return {
            success: true,
            account: accountData.data.account
        };
    }
}

module.exports = ViewUserAccountController;

