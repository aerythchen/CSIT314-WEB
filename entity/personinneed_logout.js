const { db } = require('../database');
const { SessionHelpers } = require('../database/helpers');

class LogoutEntity {
    constructor() {
        this.logoutData = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("LogoutEntity: Initializing...");
        this.logoutData = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("LogoutEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.sessionId || typeof data.sessionId !== 'string') {
            return { isValid: false, error: "Valid session ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("LogoutEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Find session
        const session = db.findById('sessions', data.sessionId);
        if (!session) {
            return {
                success: false,
                error: "Session not found"
            };
        }

        // Revoke session
        const revokeResult = SessionHelpers.revokeSession(data.sessionId);
        if (!revokeResult.success) {
            return revokeResult;
        }

        const now = new Date().toISOString();

        this.logoutData = {
            sessionId: data.sessionId,
            userId: data.userId,
            userType: 'personinneed',
            logoutTime: now,
            sessionDuration: session.createdAt ? 
                new Date(now) - new Date(session.createdAt) : 0
        };

        console.log("Person in Need logout processed successfully");
        return {
            success: true,
            message: "Person in Need logout processed",
            data: this.logoutData
        };
    }

    getData() {
        console.log("LogoutEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.logoutData
        };
    }
}

module.exports = LogoutEntity;
