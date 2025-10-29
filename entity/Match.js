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
    
    async createMatch(matchData) {
        const match = {
            id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            requestid: matchData.requestId,
            csrid: matchData.csrId,
            servicetype: matchData.serviceType,
            status: 'pending',
            completedat: null,
            notes: matchData.notes || '',
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            isdeleted: false
        };

        const result = await db.insert('matches', match);
        return result;
    }

    // ========================================
    // MATCH MANAGEMENT
    // ========================================
    
    async updateMatch(matchId, updateData) {
        const match = await db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        // Create updated match object, ensuring no duplicate fields
        const updatedMatch = {
            ...match,
            ...updateData,
            updatedat: new Date().toISOString()
        };

        // Remove the id field to avoid conflicts
        delete updatedMatch.id;

        const result = await db.update('matches', matchId, updatedMatch);
        return result;
    }

    async getMatch(matchId) {
        const match = await db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        return { success: true, data: match };
    }

    async deleteMatch(matchId) {
        const match = await db.findOne('matches', { id: matchId, isDeleted: false });
        
        if (!match) {
            return { success: false, error: "Match not found" };
        }

        const result = await db.update('matches', matchId, {
            isDeleted: true,
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    // ========================================
    // MATCH SEARCH
    // ========================================
    
    async searchMatches(searchTerm, serviceType, status, startDate, endDate) {
        let matches = await db.findAll('matches', { isDeleted: false });

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

    async getAllMatches() {
        const matches = await db.findAll('matches', { isDeleted: false });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    // ========================================
    // MATCH STATUS MANAGEMENT
    // ========================================
    
    async completeMatch(matchId, notes = '') {
        return await this.updateMatch(matchId, {
            status: 'completed',
            completedat: new Date().toISOString(),
            notes: notes
        });
    }

    async cancelMatch(matchId, notes = '') {
        return await this.updateMatch(matchId, {
            status: 'cancelled',
            notes: notes
        });
    }

    // ========================================
    // MATCH FILTERING
    // ========================================
    
    async getMatchesByRequest(requestId) {
        const matches = await db.findAll('matches', { 
            requestId: requestId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    async getMatchesByCSR(csrId) {
        const matches = await db.findAll('matches', { 
            csrId: csrId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    async getMatchesByStatus(status) {
        const matches = await db.findAll('matches', { 
            status: status, 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    async getCompletedMatches() {
        const matches = await db.findAll('matches', { 
            status: 'completed', 
            isDeleted: false 
        });

        return {
            success: true,
            data: matches,
            count: matches.length
        };
    }

    async getPendingMatches() {
        const matches = await db.findAll('matches', { 
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
    
    async getMatchStatistics(startDate, endDate) {
        // Get completed requests instead of matches for more accurate reporting
        let requests = await db.findAll('requests', { isdeleted: false });

        // Filter by date range if provided (use updatedat for completion date)
        if (startDate) {
            requests = requests.filter(r => {
                const requestDate = r.updatedat || r.createdat; // Use completion date if available, otherwise creation date
                const requestDateOnly = new Date(requestDate).toISOString().split('T')[0]; // Get just the date part
                return requestDateOnly >= startDate;
            });
        }

        if (endDate) {
            requests = requests.filter(r => {
                const requestDate = r.updatedat || r.createdat; // Use completion date if available, otherwise creation date
                const requestDateOnly = new Date(requestDate).toISOString().split('T')[0]; // Get just the date part
                return requestDateOnly <= endDate;
            });
        }

        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            completed: requests.filter(r => r.status === 'completed').length,
            assigned: requests.filter(r => r.status === 'assigned').length
        };

        console.log(`Request statistics for ${startDate} to ${endDate}:`, stats);

        return {
            success: true,
            data: stats
        };
    }


    //additional method over engineering here
    async getRequestTrends(days = 30) {
        try {
            // Debug: Try different query methods
            console.log('Trying db.findAll...');
            const allRequests = await db.findAll('requests', { isDeleted: false });
            console.log(`db.findAll result: ${allRequests.length} requests`);
            
            console.log('Trying db.find...');
            const findRequests = await db.find('requests', { isDeleted: false });
            console.log(`db.find result: ${findRequests.length} requests`);
            
            console.log('Trying db.find with no conditions...');
            const allRequestsNoFilter = await db.find('requests', {});
            console.log(`db.find (no filter) result: ${allRequestsNoFilter.length} requests`);
            
            if (allRequestsNoFilter.length > 0) {
                console.log('Sample request:', allRequestsNoFilter[0]);
                console.log('Request createdat:', allRequestsNoFilter[0].createdat);
                console.log('Request isdeleted:', allRequestsNoFilter[0].isdeleted);
            }

            // Use the working query method
            const requestsToUse = allRequestsNoFilter.length > 0 ? allRequestsNoFilter : allRequests;
            console.log(`Using ${requestsToUse.length} requests for trends`);

            // Get requests from the last N days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);

            console.log(`Looking for requests between ${startDate.toISOString()} and ${endDate.toISOString()}`);

            // Filter requests within the date range
            const filteredRequests = requestsToUse.filter(req => {
                const reqDate = new Date(req.createdat);
                return reqDate >= startDate && reqDate <= endDate;
            });

            console.log(`Filtered requests: ${filteredRequests.length}`);

            // Group by day
            const dailyCounts = {};
            for (let i = 0; i < days; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                dailyCounts[dateStr] = 0;
            }

            // Count requests per day
            filteredRequests.forEach(req => {
                const reqDate = new Date(req.createdat).toISOString().split('T')[0];
                if (dailyCounts.hasOwnProperty(reqDate)) {
                    dailyCounts[reqDate]++;
                }
            });

            // Convert to arrays for chart
            const labels = [];
            const data = [];
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const monthDay = (date.getMonth() + 1) + '/' + date.getDate();
                
                labels.push(monthDay);
                data.push(dailyCounts[dateStr] || 0);
            }

            console.log(`Request trends: Found ${filteredRequests.length} requests in last ${days} days`);
            console.log('Daily counts:', dailyCounts);

            return {
                success: true,
                data: {
                    labels: labels,
                    data: data
                }
            };
        } catch (error) {
            console.error('Error getting request trends:', error);
            return {
                success: false,
                error: error.message,
                data: {
                    labels: [],
                    data: []
                }
            };
        }
    }

    // ========================================
    // SHORTLIST MANAGEMENT
    // ========================================
    
    async addToShortlist(requestId, csrId) {
        const shortlistItem = {
            id: `shortlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            requestId: requestId,
            userId: csrId,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const result = await db.insert('shortlists', shortlistItem);
        return result;
    }

    async removeFromShortlist(requestId, csrId) {
        const shortlistItem = await db.findOne('shortlists', { 
            requestId: requestId, 
            userId: csrId, 
            isDeleted: false 
        });
        
        if (!shortlistItem) {
            return { success: false, error: "Item not found in shortlist" };
        }

        const result = await db.update('shortlists', shortlistItem.id, {
            isDeleted: true,
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    async getShortlist(csrId) {
        const shortlistItems = await db.findAll('shortlists', { 
            userId: csrId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: shortlistItems,
            count: shortlistItems.length
        };
    }
}

module.exports = Match;
