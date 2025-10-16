const SuspendUserAccountEntity = require('../entity/useradmin_suspenduseraccount');

class SuspendUserAccountController {
    constructor() {
        this.entity = new SuspendUserAccountEntity();
        this.entity.initialize();
    }

    suspendUserAccount(accountId, reason) {
        console.log("SuspendUserAccountController: Processing account suspension...");
        
        const validationResult = this.validateSuspendAction(accountId, reason);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                account: null
            };
        }
        
        return this.processSuspendAction(accountId, reason);
    }

    validateSuspendAction(accountId, reason) {
        console.log("Validating suspension request...");
        
        if (!accountId || accountId.trim() === "") {
            return { isValid: false, error: "Account ID is required" };
        }
        
        if (!reason || reason.trim() === "") {
            return { isValid: false, error: "Suspension reason is required" };
        }
        
        if (reason.length < 10) {
            return { isValid: false, error: "Suspension reason must be at least 10 characters" };
        }
        
        if (reason.length > 500) {
            return { isValid: false, error: "Suspension reason must not exceed 500 characters" };
        }
        
        return { isValid: true };
    }

    processSuspendAction(accountId, reason) {
        console.log(`Processing suspension for account: ${accountId}...`);
        
        const entityResult = this.entity.process({
            accountId: accountId.trim(),
            reason: reason.trim(),
            suspendedBy: "useradmin"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                account: null
            };
        }
        
        const accountData = this.entity.getData();
        
        console.log(`Account suspended successfully: ${accountData.data.id}`);
        
        return {
            success: true,
            account: accountData.data,
            message: "User account suspended successfully"
        };
    }
}

module.exports = SuspendUserAccountController;

