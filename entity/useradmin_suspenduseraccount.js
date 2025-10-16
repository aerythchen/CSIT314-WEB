const { db } = require('../database');

class SuspendUserAccountEntity {
    constructor() {
        this.account = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("SuspendUserAccountEntity: Initializing...");
        this.account = {
            id: null,
            username: "",
            status: "locked",
            suspensionReason: "",
            suspendedAt: null,
            suspendedBy: "useradmin"
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SuspendUserAccountEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.accountId || typeof data.accountId !== 'string') {
            return { isValid: false, error: "Valid account ID is required" };
        }

        if (!data.reason || typeof data.reason !== 'string' || data.reason.trim().length < 10) {
            return { isValid: false, error: "Valid suspension reason required (min 10 chars)" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SuspendUserAccountEntity: Processing data...");
        
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

        // Check if already suspended/locked
        if (existing.status === 'locked') {
            return {
                success: false,
                error: "Account is already locked"
            };
        }

        const now = new Date().toISOString();

        // Invalidate all active sessions for this account
        const sessions = db.find('sessions', { accountId: data.accountId, status: 'active' });
        sessions.forEach(session => {
            db.update('sessions', session.id, { status: 'revoked' });
        });

        // Update account status to locked
        const result = db.update('userAccounts', data.accountId, {
            status: "locked",
            suspensionReason: data.reason,
            suspendedAt: now,
            suspendedBy: data.suspendedBy || "useradmin"
        });

        if (!result.success) {
            return result;
        }

        this.account = result.data;
        this.account.activeSessions = 0;

        // Create audit log
        db.insert('auditLogs', {
            action: 'SUSPEND_USER_ACCOUNT',
            entityType: 'userAccount',
            entityId: this.account.id,
            performedBy: data.suspendedBy || 'useradmin',
            performedByType: 'useradmin',
            details: {
                reason: data.reason,
                sessionsRevoked: sessions.length
            }
        });

        console.log("Account suspended successfully");
        return {
            success: true,
            message: "User account suspended",
            data: {
                id: this.account.id,
                status: this.account.status,
                suspendedAt: this.account.suspendedAt
            }
        };
    }

    getData() {
        console.log("SuspendUserAccountEntity: Retrieving data...");
        
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
                suspensionReason: this.account.suspensionReason,
                suspendedAt: this.account.suspendedAt,
                suspendedBy: this.account.suspendedBy,
                activeSessions: this.account.activeSessions
            }
        };
    }
}

module.exports = SuspendUserAccountEntity;
