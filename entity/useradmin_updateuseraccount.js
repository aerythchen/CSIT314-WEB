const { db } = require('../database');

class UpdateUserAccountEntity {
    constructor() {
        this.account = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("UpdateUserAccountEntity: Initializing...");
        this.account = {
            id: null,
            username: "",
            status: "active",
            updatedAt: null,
            updatedBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("UpdateUserAccountEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.accountId || typeof data.accountId !== 'string') {
            return { isValid: false, error: "Valid account ID is required" };
        }

        if (!data.username && !data.status) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }

        if (data.username !== undefined) {
            if (typeof data.username !== 'string' || data.username.trim().length < 3) {
                return { isValid: false, error: "Valid username required (min 3 chars)" };
            }
        }

        if (data.status !== undefined) {
            const validStatuses = ["active", "inactive", "locked"];
            if (!validStatuses.includes(data.status)) {
                return { isValid: false, error: "Invalid status value" };
            }
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("UpdateUserAccountEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if account exists
        const existing = db.findById('userAccounts', data.accountId);
        if (!existing || existing.isDeleted) {
            return {
                success: false,
                error: "Account not found"
            };
        }

        // Check for duplicate username if username is being changed
        if (data.username && data.username !== existing.username) {
            const duplicate = db.findOne('userAccounts', { 
                username: data.username, 
                isDeleted: false 
            });
            
            if (duplicate && duplicate.id !== data.accountId) {
                return {
                    success: false,
                    error: "Username already exists"
                };
            }
        }

        // Prepare update object
        const updateData = {};
        if (data.username) updateData.username = data.username;
        if (data.status) updateData.status = data.status;
        updateData.updatedBy = data.updatedBy || "useradmin";

        // Update account in database
        const result = db.update('userAccounts', data.accountId, updateData);

        if (!result.success) {
            return result;
        }

        this.account = result.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'UPDATE_USER_ACCOUNT',
            entityType: 'userAccount',
            entityId: this.account.id,
            performedBy: data.updatedBy || 'useradmin',
            performedByType: 'useradmin',
            details: updateData
        });

        console.log("Account data updated successfully");
        return {
            success: true,
            message: "User account updated",
            data: {
                id: this.account.id,
                username: this.account.username,
                updatedAt: this.account.updatedAt
            }
        };
    }

    getData() {
        console.log("UpdateUserAccountEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: {
                id: this.account.id,
                username: this.account.username,
                status: this.account.status,
                updatedAt: this.account.updatedAt,
                updatedBy: this.account.updatedBy
            }
        };
    }
}

module.exports = UpdateUserAccountEntity;
