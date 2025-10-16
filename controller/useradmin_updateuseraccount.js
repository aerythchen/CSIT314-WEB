const UpdateUserAccountEntity = require('../entity/UserAdmin');

class UpdateUserAccountController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    updateUserAccount(data) {
        console.log("UpdateUserAccountController: Processing account update...");
        
        const validationResult = this.validateAccountUpdate(accountId, username, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                account: null
            };
        }
        
        return this.processAccountUpdate(accountId, username, status);
    }

    validateAccountUpdate(accountId, username, status) {
        console.log("Validating account update data...");
        
        if (!accountId || accountId.trim() === "") {
            return { isValid: false, error: "Account ID is required" };
        }
        
        if (!username && !status) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }
        
        if (username !== undefined && username !== null) {
            if (username.trim() === "") {
                return { isValid: false, error: "Username cannot be empty" };
            }
            if (username.length < 3) {
                return { isValid: false, error: "Username must be at least 3 characters" };
            }
            const usernameRegex = /^[a-zA-Z0-9_-]+$/;
            if (!usernameRegex.test(username)) {
                return { isValid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
            }
        }
        
        if (status !== undefined && status !== null) {
            const validStatuses = ["active", "inactive", "locked"];
            if (!validStatuses.includes(status)) {
                return { isValid: false, error: "Invalid status value" };
            }
        }
        
        return { isValid: true };
    }

    processAccountUpdate(accountId, username, status) {
        console.log(`Processing update for account: ${accountId}...`);
        
        const updateData = {
            accountId: accountId.trim()
        };
        
        if (username !== undefined && username !== null) {
            updateData.username = username.trim();
        }
        
        if (status !== undefined && status !== null) {
            updateData.status = status;
        }
        
        const entityResult = this.entity.process(updateData);
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                account: null
            };
        }
        
        const accountData = this.entity.getData();
        
        console.log(`Account updated successfully: ${accountData.data.username}`);
        
        return {
            success: true,
            account: accountData.data,
            message: "User account updated successfully"
        };
    }
}

module.exports = UpdateUserAccountController;

