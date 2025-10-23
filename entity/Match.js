const { db } = require('../database');
const { MatchHelpers } = require('../database/helpers');

/**
 * Match Entity - Handles match business logic
 * Contains methods for match operations and management
 */
class Match {
    constructor() {
        this.db = db;
    }

    // ========================================
    // MATCH CREATION
    // ========================================
    
    createMatch(matchData) {
        const match = {
            id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            requestId: matchData.requestId,
            csrId: matchData.csrId,
            serviceType: matchData.serviceType,
            status: 'pending',
            completedAt: null,
            notes: matchData.notes || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const result = db.insert('matches', match);
        return result;
    }

    // ========================================
    // MATCH MANAGEMENT
    // ========================================
    
    updateMatch(matchId, updateData) {
        const match = db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        const updatedMatch = {
            ...match,
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        const result = db.update('matches', matchId, updatedMatch);
        return result;
    }

    getMatch(matchId) {
        const match = db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        return { success: true, data: match };
    }

    deleteMatch(matchId) {
        const match = db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        const result = db.update('matches', matchId, {
            isDeleted: true,
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    // ========================================
    // MATCH SEARCH
    // ========================================
    
    searchMatches(searchTerm, serviceType, status, startDate, endDate) {
        let matches = db.findAll('matches', { isDeleted: false });

        // Filter by service type
        if (serviceType && serviceType !== 'all') {
            matches = matches.filter(m => m.serviceType === serviceType);
        }

        // Filter by status
        if (status && status !== 'all') {
            matches = matches.filter(m => m.status === status);
        }

        // Filter by date range
        if (startDate) {
            matches = matches.filter(m => new Date(m.createdAt) >= new Date(startDate));
        }

        if (endDate) {
            matches = matches.filter(m => new Date(m.createdAt) <= new Date(endDate));
        }

        // Filter by search term
        if (searchTerm) {
            matches = matches.filter(m =>
                m.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (m.notes && m.notes.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    getAllMatches() {
        const matches = db.findAll('matches', { isDeleted: false });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    // ========================================
    // MATCH STATUS MANAGEMENT
    // ========================================
    
    completeMatch(matchId, notes = '') {
        return this.updateMatch(matchId, {
            status: 'completed',
            completedAt: new Date().toISOString(),
            notes: notes
        });
    }

    cancelMatch(matchId, notes = '') {
        return this.updateMatch(matchId, {
            status: 'cancelled',
            notes: notes
        });
    }

    // ========================================
    // MATCH FILTERING
    // ========================================
    
    getMatchesByRequest(requestId) {
        const matches = db.findAll('matches', { 
            requestId: requestId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    getMatchesByCSR(csrId) {
        const matches = db.findAll('matches', { 
            csrId: csrId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    getMatchesByStatus(status) {
        const matches = db.findAll('matches', { 
            status: status, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    getCompletedMatches() {
        const matches = db.findAll('matches', { 
            status: 'completed', 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    getPendingMatches() {
        const matches = db.findAll('matches', { 
            status: 'pending', 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    // ========================================
    // MATCH STATISTICS
    // ========================================
    
    getMatchStatistics(startDate, endDate) {
        let matches = db.findAll('matches', { isDeleted: false });

        // Filter by date range if provided
        if (startDate) {
            matches = matches.filter(m => new Date(m.createdAt) >= new Date(startDate));
        }

        if (endDate) {
            matches = matches.filter(m => new Date(m.createdAt) <= new Date(endDate));
        }

        const stats = {
            total: matches.length,
            pending: matches.filter(m => m.status === 'pending').length,
            completed: matches.filter(m => m.status === 'completed').length,
            cancelled: matches.filter(m => m.status === 'cancelled').length
        };

        return {
            success: true,
            data: stats
        };
    }
}

module.exports = Match;
