const { db } = require('../database');

/**
 * Session Entity - Handles session business logic
 * Contains methods for session operations and management
 */
class Session {
    constructor() {
        this.db = db;
    }

    // ========================================
    // SESSION CREATION
    // ========================================
    
    async createSession(sessionData) {
        const session = {
            id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: sessionData.userId,
            token: sessionData.token,
            expiresAt: sessionData.expiresAt,
            isActive: true,
            createdAt: new Date().toISOString(),
            isDeleted: false
        };

        const result = await db.insert('sessions', session);
        return result;
    }

    // ========================================
    // SESSION MANAGEMENT
    // ========================================
    
    async deactivateSession(sessionId) {
        try {
            const updateData = {
                isActive: false,
                updatedAt: new Date().toISOString()
            };
            
            const result = await db.update('sessions', sessionId, updateData);
            return result;
        } catch (error) {
            console.error('Deactivate session error:', error);
            return { success: false, error: "Failed to deactivate session" };
        }
    }
    
    updateSession(sessionId, updateData) {
        const session = db.findOne('sessions', { id: sessionId, isDeleted: false });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        const updatedSession = {
            ...session,
            ...updateData
        };

        const result = db.update('sessions', sessionId, updatedSession);
        return result;
    }

    getSession(sessionId) {
        const session = db.findOne('sessions', { id: sessionId, isDeleted: false });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        return { success: true, data: session };
    }

    getSessionByToken(token) {
        const session = db.findOne('sessions', { 
            token: token, 
            isDeleted: false 
        });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        return { success: true, data: session };
    }

    deleteSession(sessionId) {
        const session = db.findOne('sessions', { id: sessionId, isDeleted: false });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        const result = db.update('sessions', sessionId, {
            isDeleted: true
        });

        return result;
    }

    deleteSessionByToken(token) {
        const session = db.findOne('sessions', { 
            token: token, 
            isDeleted: false 
        });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        const result = db.update('sessions', session.id, {
            isDeleted: true
        });

        return result;
    }

    // ========================================
    // SESSION VALIDATION
    // ========================================
    
    validateSession(token) {
        const session = db.findOne('sessions', { 
            token: token, 
            isDeleted: false 
        });
        
        if (!session) {
            return { success: false, error: "Invalid session" };
        }

        if (!session.isActive) {
            return { success: false, error: "Session is inactive" };
        }

        // Check if session is expired
        if (new Date() > new Date(session.expiresAt)) {
            return { success: false, error: "Session expired" };
        }

        return { success: true, data: session };
    }

    // ========================================
    // SESSION SEARCH
    // ========================================
    
    getSessionsByUser(userId) {
        const sessions = db.findAll('sessions', { 
            userId: userId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: sessions,
            count: sessions.length
        };
    }

    getActiveSessions() {
        const sessions = db.findAll('sessions', { 
            isActive: true, 
            isDeleted: false 
        });

        return {
            success: true,
            data: sessions,
            count: sessions.length
        };
    }

    getExpiredSessions() {
        const sessions = db.findAll('sessions', { 
            isDeleted: false 
        });

        const expiredSessions = sessions.filter(session => 
            new Date() > new Date(session.expiresAt)
        );

        return {
            success: true,
            data: expiredSessions,
            count: expiredSessions.length
        };
    }

    // ========================================
    // SESSION STATUS MANAGEMENT
    // ========================================
    
    deactivateSession(sessionId) {
        return this.updateSession(sessionId, { isActive: false });
    }

    deactivateSessionByToken(token) {
        const session = db.findOne('sessions', { 
            token: token, 
            isDeleted: false 
        });
        
        if (!session) {
            return { success: false, error: "Session not found" };
        }

        return this.updateSession(session.id, { isActive: false });
    }

    activateSession(sessionId) {
        return this.updateSession(sessionId, { isActive: true });
    }

    // ========================================
    // SESSION CLEANUP
    // ========================================
    
    cleanupExpiredSessions() {
        const expiredSessions = this.getExpiredSessions();
        
        if (!expiredSessions.success) {
            return expiredSessions;
        }

        let cleanedCount = 0;
        for (const session of expiredSessions.data) {
            const result = this.deleteSession(session.id);
            if (result.success) {
                cleanedCount++;
            }
        }

        return {
            success: true,
            message: `Cleaned up ${cleanedCount} expired sessions`,
            cleanedCount: cleanedCount
        };
    }

    deactivateAllUserSessions(userId) {
        const sessions = db.findAll('sessions', { 
            userId: userId, 
            isDeleted: false 
        });

        let deactivatedCount = 0;
        for (const session of sessions) {
            const result = this.deactivateSession(session.id);
            if (result.success) {
                deactivatedCount++;
            }
        }

        return {
            success: true,
            message: `Deactivated ${deactivatedCount} sessions for user`,
            deactivatedCount: deactivatedCount
        };
    }

    // ========================================
    // SESSION GENERATION
    // ========================================
    
    generateSessionToken() {
        return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateSessionExpiry(hours = 24) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + hours);
        return expiresAt.toISOString();
    }
}

module.exports = Session;
