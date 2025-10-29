const { db } = require('../database');
const { RequestHelpers } = require('../database/helpers');
const Match = require('./Match');

/**
 * Request Entity - Handles request business logic
 * Contains methods for request operations and management
 */
class Request {
    constructor() {
        this.db = db;
        this.matchEntity = new Match();
    }

    // ========================================
    // REQUEST CREATION
    // ========================================
    
    createRequest(requestData) {
        const request = {
            id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdBy: requestData.createdBy,
            createdByName: requestData.createdByName,
            categoryId: requestData.categoryId,
            categoryName: requestData.categoryName,
            title: requestData.title,
            description: requestData.description,
            urgency: requestData.urgency || 'medium',
            status: 'pending',
            viewCount: 0,
            shortlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const result = db.insert('requests', request);
        return result;
    }

    // ========================================
    // REQUEST MANAGEMENT
    // ========================================
    
    updateRequest(requestId, updateData) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const updatedRequest = {
            ...request,
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        const result = db.update('requests', requestId, updatedRequest);
        return result;
    }

    getRequest(requestId) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        return { success: true, data: request };
    }

    deleteRequest(requestId) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const result = db.update('requests', requestId, {
            isDeleted: true,
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    // ========================================
    // REQUEST SEARCH
    // ========================================
    
    searchRequests(searchTerm, category, urgency, status) {
        let requests = db.findAll('requests', { isDeleted: false });

        // Filter by search term
        if (searchTerm) {
            requests = requests.filter(req =>
                req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (category && category !== 'all') {
            requests = requests.filter(req => req.categoryName === category);
        }

        // Filter by urgency
        if (urgency && urgency !== 'all') {
            requests = requests.filter(req => req.urgency === urgency);
        }

        // Filter by status
        if (status && status !== 'all') {
            requests = requests.filter(req => req.status === status);
        }

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    // ========================================
    // REQUEST STATUS MANAGEMENT
    // ========================================
    
    approveRequest(requestId) {
        return this.updateRequest(requestId, { status: 'approved' });
    }

    rejectRequest(requestId) {
        return this.updateRequest(requestId, { status: 'rejected' });
    }

    completeRequest(requestId) {
        return this.updateRequest(requestId, { status: 'completed' });
    }

    // ========================================
    // REQUEST VIEWING
    // ========================================
    
    incrementViewCount(requestId) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const newViewCount = (request.viewCount || 0) + 1;
        return this.updateRequest(requestId, { viewCount: newViewCount });
    }

	// ========================================
	// CSR-FACING OPERATIONS (Search/View/Shortlist)
	// ========================================

	async searchOpportunities(searchTerm, category, urgency) {
		try {
			// Get all requests that are not deleted
			let query = `
				SELECT r.*, up.firstName || ' ' || up.lastName as createdByName, c.name as categoryName
				FROM requests r
				JOIN userProfiles up ON r.createdBy = up.id
				JOIN categories c ON r.categoryId = c.id
				WHERE r.isDeleted = false
			`;
			
			const queryParams = [];
			
			// Add search term filter if provided
			if (searchTerm && searchTerm.trim()) {
				query += ` AND (r.title ILIKE $${queryParams.length + 1} OR r.description ILIKE $${queryParams.length + 1})`;
				queryParams.push(`%${searchTerm.trim()}%`);
			}
			
			// Add category filter if provided
			if (category && category !== 'all') {
				query += ` AND c.name = $${queryParams.length + 1}`;
				queryParams.push(category);
			}
			
			// Add urgency filter if provided
			if (urgency && urgency !== 'all') {
				query += ` AND r.urgency = $${queryParams.length + 1}`;
				queryParams.push(urgency);
			}
			
			// Exclude requests that have already been accepted (have matches)
			query += ` AND r.id NOT IN (
				SELECT DISTINCT m.requestId 
				FROM matches m 
				WHERE m.isDeleted = false
			)`;
			
			query += ` ORDER BY r.createdAt DESC`;
			
			const result = await this.db.pool.query(query, queryParams);
			const requests = result.rows;

			// Normalize field names from database to camelCase for frontend
			const normalizedRequests = requests.map(req => ({
				id: req.id,
				createdBy: req.createdby,
				createdByName: req.createdbyname,
				categoryId: req.categoryid,
				categoryName: req.categoryname,
				title: req.title,
				description: req.description,
				urgency: req.urgency,
				status: req.status,
				viewCount: req.viewcount,
				shortlistCount: req.shortlistcount,
				createdAt: req.createdat,
				updatedAt: req.updatedat,
				isDeleted: req.isdeleted
			}));

			return {
				success: true,
				data: { opportunities: normalizedRequests },
				count: normalizedRequests.length
			};
		} catch (error) {
			console.error('Request.searchOpportunities error:', error);
			return { success: false, error: 'Failed to search opportunities' };
		}
	}

	async viewOpportunity(opportunityId) {
		try {
			if (!opportunityId) {
				return { success: false, error: 'Opportunity ID is required' };
			}

			const request = await this.db.findById('requests', opportunityId);
			if (!request) {
				return { success: false, error: 'Opportunity not found' };
			}

			const updated = await this._incrementViewCountAsync(request);
			const finalRequest = updated || request;
			
			// Normalize field names from database to camelCase for frontend
			const normalizedRequest = {
				id: finalRequest.id,
				createdBy: finalRequest.createdby,
				createdByName: finalRequest.createdbyname,
				categoryId: finalRequest.categoryid,
				categoryName: finalRequest.categoryname,
				title: finalRequest.title,
				description: finalRequest.description,
				urgency: finalRequest.urgency,
				status: finalRequest.status,
				viewCount: finalRequest.viewcount,
				shortlistCount: finalRequest.shortlistcount,
				createdAt: finalRequest.createdat,
				updatedAt: finalRequest.updatedat,
				isDeleted: finalRequest.isdeleted
			};

			return {
				success: true,
				message: 'Opportunity loaded successfully',
				data: { opportunity: normalizedRequest }
			};
		} catch (error) {
			console.error('Request.viewOpportunity error:', error);
			return { success: false, error: 'Failed to load opportunity' };
		}
	}

	async saveToShortlist(userId, opportunityId) {
		try {
			if (!userId) {
				return { success: false, error: 'User ID is required' };
			}
			if (!opportunityId) {
				return { success: false, error: 'Opportunity ID is required' };
			}

			const existing = await this.db.findOne('shortlists', {
				userId: userId,
				requestId: opportunityId,
				isDeleted: false
			});

			if (existing) {
				if (existing.isActive) {
					return { success: false, error: 'Request already in shortlist' };
				}

				const reactivated = await this.db.update('shortlists', existing.id, {
					isActive: true,
					updatedAt: new Date().toISOString()
				});

				if (!reactivated.success) {
					return { success: false, error: 'Failed to update shortlist' };
				}

				await this._incrementShortlistCountAsync(opportunityId, +1);
				return { success: true, message: 'Opportunity added to shortlist', data: reactivated.data };
			}

			const shortlistData = {
				id: `shortlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				userId: userId,
				requestId: opportunityId,
				isActive: true,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isDeleted: false
			};

			const created = await this.db.insert('shortlists', shortlistData);
			if (created && typeof created.then === 'function') {
				const res = await created;
				if (!res.success) {
					return { success: false, error: 'Failed to add to shortlist' };
				}
			} else if (!created.success) {
				return { success: false, error: 'Failed to add to shortlist' };
			}

			await this._incrementShortlistCountAsync(opportunityId, +1);
			return { success: true, message: 'Opportunity added to shortlist', data: created.data };
		} catch (error) {
			console.error('Request.saveToShortlist error:', error);
			return { success: false, error: 'Failed to add to shortlist' };
		}
	}

	async _incrementViewCountAsync(request) {
		try {
			const newCount = (request.viewCount || 0) + 1;
			const updated = await this.db.update('requests', request.id, {
				viewCount: newCount,
				updatedAt: new Date().toISOString()
			});
			return updated.success ? updated.data : null;
		} catch (error) {
			console.error('Request._incrementViewCountAsync error:', error);
			return null;
		}
	}

	async _incrementShortlistCountAsync(requestId, delta) {
		try {
			const req = await this.db.findById('requests', requestId);
			if (!req) return;
			const next = Math.max(0, (req.shortlistCount || 0) + delta);
			await this.db.update('requests', requestId, {
				shortlistCount: next,
				updatedAt: new Date().toISOString()
			});
		} catch (error) {
			console.error('Request._incrementShortlistCountAsync error:', error);
		}
	}

    // ========================================
    // REQUEST SHORTLISTING
    // ========================================
    
    incrementShortlistCount(requestId) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const newShortlistCount = (request.shortlistCount || 0) + 1;
        return this.updateRequest(requestId, { shortlistCount: newShortlistCount });
    }

    decrementShortlistCount(requestId) {
        const request = db.findOne('requests', { id: requestId, isDeleted: false });
        
        if (!request) {
            return { success: false, error: "Request not found" };
        }

        const newShortlistCount = Math.max((request.shortlistCount || 0) - 1, 0);
        return this.updateRequest(requestId, { shortlistCount: newShortlistCount });
    }

    // ========================================
    // REQUEST FILTERING
    // ========================================
    
    getRequestsByUser(userId) {
        const requests = db.findAll('requests', { 
            createdBy: userId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    getRequestsByCategory(categoryId) {
        const requests = db.findAll('requests', { 
            categoryId: categoryId, 
            isDeleted: false 
        });

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    getRequestsByStatus(status) {
        const requests = db.findAll('requests', { 
            status: status, 
            isDeleted: false 
        });

        return {
            success: true,
            data: requests,
            count: requests.length
        };
    }

    // ========================================
    // SHORTLIST OPERATIONS
    // ========================================
    
    async addToShortlist(userId, requestId) {
        try {
            // Check if already in shortlist
            const existing = await db.findOne('shortlists', {
                userId: userId,
                requestId: requestId,
                isDeleted: false
            });

            if (existing) {
                if (existing.isActive) {
                    return { success: false, error: "Request already in shortlist" };
                } else {
                    // Reactivate existing shortlist entry
                    const result = await db.update('shortlists', existing.id, {
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    });
                    return result;
                }
            }

            // Create new shortlist entry
            const shortlistData = {
                id: `shortlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: userId,
                requestId: requestId,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDeleted: false
            };

            const result = await db.insert('shortlists', shortlistData);
            
            if (result.success) {
                // Update request shortlist count
                await this.updateRequestShortlistCount(requestId, 1);
                return { success: true, data: result.data, message: "Added to shortlist" };
            }
            
            return { success: false, error: "Failed to add to shortlist" };
        } catch (error) {
            console.error('Add to shortlist error:', error);
            return { success: false, error: "Failed to add to shortlist" };
        }
    }

    async removeFromShortlist(userId, requestId) {
        try {
            const shortlist = await db.findOne('shortlists', {
                userId: userId,
                requestId: requestId,
                isActive: true,
                isDeleted: false
            });

            if (!shortlist) {
                return { success: false, error: "Request not in shortlist" };
            }

            // Deactivate shortlist entry
            const result = await db.update('shortlists', shortlist.id, {
                isActive: false,
                updatedAt: new Date().toISOString()
            });

            if (result.success) {
                // Update request shortlist count
                await this.updateRequestShortlistCount(requestId, -1);
                return { success: true, message: "Removed from shortlist" };
            }
            
            return { success: false, error: "Failed to remove from shortlist" };
        } catch (error) {
            console.error('Remove from shortlist error:', error);
            return { success: false, error: "Failed to remove from shortlist" };
        }
    }

    async getUserShortlist(userId) {
        try {
            const shortlists = await db.find('shortlists', {
                userId: userId,
                isActive: true,
                isDeleted: false
            });

            // Get request details for each shortlist item
            const shortlistWithRequests = [];
            for (const shortlist of shortlists) {
                const request = await db.findOne('requests', {
                    id: shortlist.requestId,
                    isDeleted: false
                });
                
                if (request) {
                    shortlistWithRequests.push({
                        shortlistId: shortlist.id,
                        request: request,
                        addedAt: shortlist.createdAt
                    });
                }
            }

            return { success: true, data: shortlistWithRequests };
        } catch (error) {
            console.error('Get user shortlist error:', error);
            return { success: false, error: "Failed to get shortlist" };
        }
    }

    async isInShortlist(userId, requestId) {
        try {
            const shortlist = await db.findOne('shortlists', {
                userId: userId,
                requestId: requestId,
                isActive: true,
                isDeleted: false
            });

            return { success: true, data: !!shortlist };
        } catch (error) {
            console.error('Check shortlist error:', error);
            return { success: false, error: "Failed to check shortlist" };
        }
    }

    async updateRequestShortlistCount(requestId, increment) {
        try {
            const request = await db.findOne('requests', {
                id: requestId,
                isDeleted: false
            });

            if (request) {
                const newCount = Math.max(0, (request.shortlistCount || 0) + increment);
                await db.update('requests', requestId, {
                    shortlistCount: newCount,
                    updatedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Update shortlist count error:', error);
        }
    }

    async getShortlistStats(userId) {
        try {
            const shortlists = await db.find('shortlists', {
                userId: userId,
                isActive: true,
                isDeleted: false
            });

            return {
                success: true,
                data: {
                    totalShortlisted: shortlists.length,
                    shortlists: shortlists
                }
            };
        } catch (error) {
            console.error('Get shortlist stats error:', error);
            return { success: false, error: "Failed to get shortlist stats" };
        }
    }

    // ========================================
    // SHORTLIST VIEWING AND SEARCHING
    // ========================================

    async getUserShortlist(userId) {
        try {
            console.log(`Getting shortlist for user: ${userId}`);
            
            const query = `
                SELECT 
                    s.id as shortlistId,
                    s.createdAt as shortlistCreatedAt,
                    r.id,
                    r.title,
                    r.description,
                    r.urgency,
                    r.status,
                    r.viewCount,
                    r.shortlistCount,
                    r.createdAt,
                    r.createdBy,
                    up.firstName || ' ' || up.lastName as createdByName,
                    c.name as categoryName
                FROM shortlists s
                JOIN requests r ON s.requestId = r.id
                JOIN userProfiles up ON r.createdBy = up.id
                JOIN categories c ON r.categoryId = c.id
                WHERE s.userId = $1 
                AND s.isActive = true 
                AND s.isDeleted = false
                AND r.isDeleted = false
                AND r.id NOT IN (
                    SELECT DISTINCT m.requestId 
                    FROM matches m 
                    WHERE m.isDeleted = false
                )
                ORDER BY s.createdAt DESC
            `;
            
            const result = await this.db.pool.query(query, [userId]);
            
            // Normalize field names to camelCase
            const shortlistItems = result.rows.map(row => ({
                shortlistId: row.shortlistid,
                shortlistCreatedAt: row.shortlistcreatedat,
                id: row.id,
                title: row.title,
                description: row.description,
                urgency: row.urgency,
                status: row.status,
                viewCount: row.viewcount,
                shortlistCount: row.shortlistcount,
                createdAt: row.createdat,
                createdBy: row.createdby,
                createdByName: row.createdbyname,
                categoryName: row.categoryname
            }));
            
            console.log(`Found ${shortlistItems.length} items in shortlist for user ${userId}`);
            
            return {
                success: true,
                data: {
                    shortlistItems: shortlistItems,
                    count: shortlistItems.length
                },
                message: `Found ${shortlistItems.length} items in your shortlist`
            };
            
        } catch (error) {
            console.error('Get user shortlist error:', error);
            return { success: false, error: "Failed to get user shortlist" };
        }
    }

    async searchUserShortlist(userId, searchTerm = '', category = '', urgency = '') {
        try {
            console.log(`Searching shortlist for user: ${userId}, term: "${searchTerm}", category: "${category}", urgency: "${urgency}"`);
            
            let query = `
                SELECT 
                    s.id as shortlistId,
                    s.createdAt as shortlistCreatedAt,
                    r.id,
                    r.title,
                    r.description,
                    r.urgency,
                    r.status,
                    r.viewCount,
                    r.shortlistCount,
                    r.createdAt,
                    r.createdBy,
                    up.firstName || ' ' || up.lastName as createdByName,
                    c.name as categoryName
                FROM shortlists s
                JOIN requests r ON s.requestId = r.id
                JOIN userProfiles up ON r.createdBy = up.id
                JOIN categories c ON r.categoryId = c.id
                WHERE s.userId = $1 
                AND s.isActive = true 
                AND s.isDeleted = false
                AND r.isDeleted = false
            `;
            
            const params = [userId];
            let paramCount = 1;
            
            // Add search term filter
            if (searchTerm && searchTerm.trim()) {
                paramCount++;
                query += ` AND (LOWER(r.title) LIKE LOWER($${paramCount}) OR LOWER(r.description) LIKE LOWER($${paramCount}))`;
                params.push(`%${searchTerm.trim()}%`);
            }
            
            // Add category filter
            if (category && category.trim()) {
                paramCount++;
                query += ` AND c.name = $${paramCount}`;
                params.push(category.trim());
            }
            
            // Add urgency filter
            if (urgency && urgency.trim()) {
                paramCount++;
                query += ` AND r.urgency = $${paramCount}`;
                params.push(urgency.trim());
            }
            
            // Exclude requests that have already been accepted (have matches)
            query += ` AND r.id NOT IN (
                SELECT DISTINCT m.requestId 
                FROM matches m 
                WHERE m.isDeleted = false
            )`;
            
            query += ` ORDER BY s.createdAt DESC`;
            
            const result = await this.db.pool.query(query, params);
            
            // Normalize field names to camelCase
            const shortlistItems = result.rows.map(row => ({
                shortlistId: row.shortlistid,
                shortlistCreatedAt: row.shortlistcreatedat,
                id: row.id,
                title: row.title,
                description: row.description,
                urgency: row.urgency,
                status: row.status,
                viewCount: row.viewcount,
                shortlistCount: row.shortlistcount,
                createdAt: row.createdat,
                createdBy: row.createdby,
                createdByName: row.createdbyname,
                categoryName: row.categoryname
            }));
            
            console.log(`Found ${shortlistItems.length} matching items in shortlist for user ${userId}`);
            
            return {
                success: true,
                data: {
                    shortlistItems: shortlistItems,
                    count: shortlistItems.length,
                    searchTerm: searchTerm,
                    category: category,
                    urgency: urgency
                },
                message: `Found ${shortlistItems.length} items matching your search criteria`
            };
            
        } catch (error) {
            console.error('Search user shortlist error:', error);
            return { success: false, error: "Failed to search user shortlist" };
        }
    }

    // ========================================
    // HISTORY VIEWING AND SEARCHING
    // ========================================

    async getUserHistory(userId) {
        try {
            console.log(`Getting match history for user: ${userId}`);
            
            const query = `
                SELECT 
                    m.id as matchId,
                    m.serviceType,
                    m.completedAt,
                    m.notes,
                    m.createdAt as matchCreatedAt,
                    r.id as requestId,
                    r.title,
                    r.description,
                    r.urgency,
                    r.status as requestStatus,
                    r.viewCount,
                    r.shortlistCount,
                    r.createdAt as requestCreatedAt,
                    r.createdBy,
                    up.firstName || ' ' || up.lastName as createdByName,
                    c.name as categoryName
                FROM matches m
                JOIN requests r ON m.requestId = r.id
                JOIN userProfiles up ON r.createdBy = up.id
                JOIN categories c ON r.categoryId = c.id
                WHERE m.csrId = $1 
                AND m.isDeleted = false
                AND r.isDeleted = false
                ORDER BY m.createdAt DESC
            `;
            
            const result = await this.db.pool.query(query, [userId]);
            
            // Normalize field names to camelCase
            const historyItems = result.rows.map(row => ({
                matchId: row.matchid,
                serviceType: row.servicetype,
                completedAt: row.completedat,
                notes: row.notes,
                matchCreatedAt: row.matchcreatedat,
                requestId: row.requestid,
                title: row.title,
                description: row.description,
                urgency: row.urgency,
                requestStatus: row.requeststatus,
                viewCount: row.viewcount,
                shortlistCount: row.shortlistcount,
                requestCreatedAt: row.requestcreatedat,
                createdBy: row.createdby,
                createdByName: row.createdbyname,
                categoryName: row.categoryname
            }));
            
            console.log(`Found ${historyItems.length} history items for user ${userId}`);
            
            return {
                success: true,
                data: {
                    historyItems: historyItems,
                    count: historyItems.length
                },
                message: `Found ${historyItems.length} completed matches in your history`
            };
            
        } catch (error) {
            console.error('Get user history error:', error);
            return { success: false, error: "Failed to get user history" };
        }
    }

    async searchUserHistory(userId, searchTerm = '', category = '', urgency = '', status = '') {
        try {
            console.log(`Searching history for user: ${userId}, term: "${searchTerm}", category: "${category}", urgency: "${urgency}", status: "${status}"`);
            
            let query = `
                SELECT 
                    m.id as matchId,
                    m.serviceType,
                    m.completedAt,
                    m.notes,
                    m.createdAt as matchCreatedAt,
                    r.id as requestId,
                    r.title,
                    r.description,
                    r.urgency,
                    r.status as requestStatus,
                    r.viewCount,
                    r.shortlistCount,
                    r.createdAt as requestCreatedAt,
                    r.createdBy,
                    up.firstName || ' ' || up.lastName as createdByName,
                    c.name as categoryName
                FROM matches m
                JOIN requests r ON m.requestId = r.id
                JOIN userProfiles up ON r.createdBy = up.id
                JOIN categories c ON r.categoryId = c.id
                WHERE m.csrId = $1 
                AND m.isDeleted = false
                AND r.isDeleted = false
            `;
            
            const params = [userId];
            let paramCount = 1;
            
            // Add search term filter
            if (searchTerm && searchTerm.trim()) {
                paramCount++;
                query += ` AND (LOWER(r.title) LIKE LOWER($${paramCount}) OR LOWER(r.description) LIKE LOWER($${paramCount}))`;
                params.push(`%${searchTerm.trim()}%`);
            }
            
            // Add category filter
            if (category && category.trim()) {
                paramCount++;
                query += ` AND c.name = $${paramCount}`;
                params.push(category.trim());
            }
            
            // Add urgency filter
            if (urgency && urgency.trim()) {
                paramCount++;
                query += ` AND r.urgency = $${paramCount}`;
                params.push(urgency.trim());
            }
            
            // Add status filter (using request status, not match status)
            if (status && status.trim()) {
                paramCount++;
                query += ` AND r.status = $${paramCount}`;
                params.push(status.trim());
            }
            
            query += ` ORDER BY m.createdAt DESC`;
            
            const result = await this.db.pool.query(query, params);
            
            // Normalize field names to camelCase
            const historyItems = result.rows.map(row => ({
                matchId: row.matchid,
                serviceType: row.servicetype,
                completedAt: row.completedat,
                notes: row.notes,
                matchCreatedAt: row.matchcreatedat,
                requestId: row.requestid,
                title: row.title,
                description: row.description,
                urgency: row.urgency,
                requestStatus: row.requeststatus,
                viewCount: row.viewcount,
                shortlistCount: row.shortlistcount,
                requestCreatedAt: row.requestcreatedat,
                createdBy: row.createdby,
                createdByName: row.createdbyname,
                categoryName: row.categoryname
            }));
            
            console.log(`Found ${historyItems.length} matching history items for user ${userId}`);
            
            return {
                success: true,
                data: {
                    historyItems: historyItems,
                    count: historyItems.length,
                    searchTerm: searchTerm,
                    category: category,
                    urgency: urgency,
                    status: status
                },
                message: `Found ${historyItems.length} items matching your search criteria`
            };
            
        } catch (error) {
            console.error('Search user history error:', error);
            return { success: false, error: "Failed to search user history" };
        }
    }

    // ========================================
    // REQUEST ACCEPTANCE
    // ========================================

    async acceptRequest(userId, requestId, serviceType = 'General Assistance') {
        try {
            console.log(`Accepting request ${requestId} for user ${userId} with service type: ${serviceType}`);
            
            // Check if request exists and is not already matched
            const requestQuery = `
                SELECT r.*, up.firstName || ' ' || up.lastName as createdByName
                FROM requests r
                JOIN userProfiles up ON r.createdBy = up.id
                WHERE r.id = $1 AND r.isDeleted = false
            `;
            
            const requestResult = await this.db.pool.query(requestQuery, [requestId]);
            
            if (requestResult.rows.length === 0) {
                return { success: false, error: "Request not found" };
            }
            
            const request = requestResult.rows[0];
            
            // Check if this CSR has already accepted this request
            const existingMatchQuery = `
                SELECT id FROM matches 
                WHERE requestid = $1 AND csrid = $2 AND isdeleted = false
            `;
            
            const existingMatch = await this.db.pool.query(existingMatchQuery, [requestId, userId]);
            
            if (existingMatch.rows.length > 0) {
                return { success: false, error: "You have already accepted this request" };
            }
            
            // Create match entry using Match entity
            const matchData = {
                requestId: requestId,
                csrId: userId,
                serviceType: serviceType,
                notes: ''
            };
            
            const matchResult = this.matchEntity.createMatch(matchData);
            
            if (!matchResult.success) {
                return { success: false, error: matchResult.error };
            }
            
            console.log(`✅ Match created successfully: ${matchResult.data.id}`);
            
            // Update request status from pending to assigned
            await this.db.pool.query(`
                UPDATE requests 
                SET status = 'assigned', updatedat = $1
                WHERE id = $2
            `, [new Date().toISOString(), requestId]);
            
            console.log(`✅ Request status updated to assigned: ${requestId}`);
            
            return {
                success: true,
                data: {
                    matchId: matchResult.data.id,
                    requestId: requestId,
                    serviceType: serviceType,
                    status: 'assigned',
                    createdAt: matchResult.data.createdAt
                },
                message: `Request accepted and assigned successfully. Match created with ID: ${matchResult.data.id}`
            };
            
        } catch (error) {
            console.error('Accept request error:', error);
            return { success: false, error: "Failed to accept request" };
        }
    }

    async completeMatch(userId, matchId, notes = '') {
        try {
            console.log(`Completing match ${matchId} for user ${userId}`);
            
            // Check if match exists and belongs to the user
            const matchQuery = `
                SELECT m.*, r.title, r.description
                FROM matches m
                JOIN requests r ON m.requestid = r.id
                WHERE m.id = $1 AND m.csrid = $2 AND m.isdeleted = false
            `;
            
            const matchResult = await this.db.pool.query(matchQuery, [matchId, userId]);
            
            if (matchResult.rows.length === 0) {
                return { success: false, error: "Match not found or you don't have permission to complete it" };
            }
            
            const match = matchResult.rows[0];
            
            // Check if request is already completed
            const requestQuery = `
                SELECT status FROM requests WHERE id = $1
            `;
            const requestResult = await this.db.pool.query(requestQuery, [match.requestid]);
            
            if (requestResult.rows.length === 0) {
                return { success: false, error: "Request not found" };
            }
            
            if (requestResult.rows[0].status === 'completed') {
                return { success: false, error: "This request is already completed" };
            }
            
            // Update match with completion details using Match entity
            const completedAt = new Date().toISOString();
            
            const updateResult = this.matchEntity.completeMatch(matchId, notes);
            
            if (!updateResult.success) {
                return { success: false, error: updateResult.error };
            }
            
            console.log(`✅ Match completed successfully: ${matchId}`);
            
            // Update request status from assigned to completed
            await this.db.pool.query(`
                UPDATE requests 
                SET status = 'completed', updatedat = $1
                WHERE id = $2
            `, [updatedAt, match.requestid]);
            
            console.log(`✅ Request status updated to completed: ${match.requestid}`);
            
            return {
                success: true,
                data: {
                    matchId: matchId,
                    requestId: match.requestid,
                    status: 'completed',
                    completedAt: updateResult.data.completedAt,
                    notes: notes
                },
                message: `Match and request completed successfully. Request: ${match.title}`
            };
            
        } catch (error) {
            console.error('Complete match error:', error);
            return { success: false, error: "Failed to complete match" };
        }
    }

    // ========================================
    // GET USER REQUESTS
    // ========================================
    
    async getRequestsByUser(userId) {
        try {
            console.log(`Getting requests for user: ${userId}`);
            
            const requests = await this.db.find('requests', {
                createdby: userId,
                isdeleted: false,
                status: { $ne: 'completed' }  // Exclude completed requests
            });
            
            if (!requests || requests.length === 0) {
                return {
                    success: true,
                    data: {
                        requests: [],
                        message: "No requests found"
                    }
                };
            }
            
            // Sort by creation date (newest first)
            requests.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
            
            return {
                success: true,
                data: {
                    requests: requests,
                    count: requests.length
                }
            };
            
        } catch (error) {
            console.error('Get user requests error:', error);
            return { success: false, error: "Failed to get user requests" };
        }
    }

    // ========================================
    // DELETE REQUEST
    // ========================================
    
    async deleteRequest(requestId, userId) {
        try {
            console.log(`Deleting request ${requestId} for user ${userId}`);
            
            // Check if request exists and belongs to user
            const request = await this.db.findOne('requests', {
                id: requestId,
                createdby: userId,
                isdeleted: false
            });
            
            if (!request) {
                return {
                    success: false,
                    error: "Request not found or you don't have permission to delete it"
                };
            }
            
            // Soft delete - mark as deleted
            const result = await this.db.update('requests', requestId, {
                isdeleted: true,
                updatedat: new Date().toISOString()
            });
            
            if (result.success) {
                console.log(`✅ Request deleted successfully: ${requestId}`);
                return {
                    success: true,
                    message: "Request deleted successfully",
                    data: {
                        requestId: requestId,
                        deletedAt: new Date().toISOString()
                    }
                };
            } else {
                return {
                    success: false,
                    error: "Failed to delete request"
                };
            }
            
        } catch (error) {
            console.error('Delete request error:', error);
            return { success: false, error: "Failed to delete request" };
        }
    }

    // ========================================
    // UPDATE REQUEST
    // ========================================
    
    async updateRequest(requestId, userId, updateData) {
        try {
            console.log(`Updating request ${requestId} for user ${userId}`);
            
            // Check if request exists and belongs to user
            const request = await this.db.findOne('requests', {
                id: requestId,
                createdby: userId,
                isdeleted: false
            });
            
            if (!request) {
                return {
                    success: false,
                    error: "Request not found or you don't have permission to update it"
                };
            }
            
            // Prepare update data
            const updateFields = {
                updatedat: new Date().toISOString()
            };
            
            // Only update fields that are provided
            if (updateData.title !== undefined) {
                updateFields.title = updateData.title;
            }
            if (updateData.description !== undefined) {
                updateFields.description = updateData.description;
            }
            if (updateData.urgency !== undefined) {
                updateFields.urgency = updateData.urgency;
            }
            
            // Update the request
            const result = await this.db.update('requests', requestId, updateFields);
            
            if (result.success) {
                console.log(`✅ Request updated successfully: ${requestId}`);
                return {
                    success: true,
                    message: "Request updated successfully",
                    data: {
                        requestId: requestId,
                        updatedAt: updateFields.updatedat,
                        updatedFields: updateData
                    }
                };
            } else {
                return {
                    success: false,
                    error: "Failed to update request"
                };
            }
            
        } catch (error) {
            console.error('Update request error:', error);
            return { success: false, error: "Failed to update request" };
        }
    }

    // ========================================
    // GET COMPLETED REQUESTS (FOR HISTORY)
    // ========================================
    
    async getCompletedRequestsByUser(userId, filters = {}) {
        try {
            console.log(`Getting completed requests for user: ${userId} with filters:`, filters);
            
            // Build base query
            let query = {
                createdby: userId,
                isdeleted: false,
                status: 'completed'
            };
            
            // Add category filter if provided
            if (filters.category) {
                query.categoryname = filters.category;
            }
            
            // Add urgency filter if provided
            if (filters.urgency) {
                query.urgency = filters.urgency;
            }
            
            // Add status filter if provided
            if (filters.status) {
                query.status = filters.status;
            }
            
            // Add date range filter if provided
            if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
                const dateQuery = {};
                if (filters.dateRange.from) {
                    dateQuery.$gte = new Date(filters.dateRange.from);
                }
                if (filters.dateRange.to) {
                    const toDate = new Date(filters.dateRange.to);
                    toDate.setHours(23, 59, 59, 999); // End of day
                    dateQuery.$lte = toDate;
                }
                query.createdat = dateQuery;
            }
            
            const requests = await this.db.find('requests', query);
            
            if (!requests || requests.length === 0) {
                return {
                    success: true,
                    data: {
                        requests: [],
                        message: "No completed requests found"
                    }
                };
            }
            
            // Sort by completion date (newest first)
            requests.sort((a, b) => new Date(b.updatedat) - new Date(a.updatedat));
            
            return {
                success: true,
                data: {
                    requests: requests,
                    count: requests.length
                }
            };
            
        } catch (error) {
            console.error('Get completed requests error:', error);
            return { success: false, error: "Failed to get completed requests" };
        }
    }

    // ========================================
    // SEARCH USER REQUESTS
    // ========================================
    
    async searchUserRequests(userId, filters = {}) {
        try {
            console.log(`Searching requests for user: ${userId} with filters:`, filters);
            
            // Build search query
            let query = {
                createdby: userId,
                isdeleted: false
            };
            
            // Add status filter
            if (filters.status && filters.status !== 'All') {
                query.status = filters.status.toLowerCase();
            }
            
            // Add category filter
            if (filters.category && filters.category !== '') {
                query.categoryname = filters.category;
            }
            
            // Add urgency filter
            if (filters.urgency && filters.urgency !== '') {
                query.urgency = filters.urgency.toLowerCase();
            }
            
            // Get all requests first
            let requests = await this.db.find('requests', query);
            
            // Apply date range filter
            if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
                const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
                const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
                
                requests = requests.filter(request => {
                    const requestDate = new Date(request.createdat);
                    
                    if (fromDate && toDate) {
                        return requestDate >= fromDate && requestDate <= toDate;
                    } else if (fromDate) {
                        return requestDate >= fromDate;
                    } else if (toDate) {
                        return requestDate <= toDate;
                    }
                    return true;
                });
            }
            
            // Sort by creation date (newest first)
            requests.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));
            
            return {
                success: true,
                data: {
                    requests: requests,
                    count: requests.length
                }
            };
            
        } catch (error) {
            console.error('Search user requests error:', error);
            return { success: false, error: "Failed to search requests" };
        }
    }

    // ========================================
    // TRACK VIEWS
    // ========================================
    
    async trackViews(requestId, userId) {
        try {
            console.log(`Tracking views for request ${requestId} by user ${userId}`);
            
            // Get current request to check if it exists
            const request = await this.db.findOne('requests', { id: requestId, isdeleted: false });
            if (!request) {
                return { success: false, error: "Request not found" };
            }
            
            // Increment view count
            const currentViewCount = request.viewcount || 0;
            const newViewCount = currentViewCount + 1;
            
            // Update the view count in the database
            await this.db.update('requests', 
                { id: requestId }, 
                { viewcount: newViewCount }
            );
            
            console.log(`View count updated: ${currentViewCount} → ${newViewCount}`);
            
            return {
                success: true,
                message: "View count incremented successfully",
                data: {
                    requestId: requestId,
                    userId: userId,
                    viewCount: newViewCount,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            console.error('Track views error:', error);
            return { success: false, error: "Failed to track views" };
        }
    }

    // ========================================
    // TRACK SHORTLIST
    // ========================================
    
    async trackShortlist(requestId, userId) {
        try {
            console.log(`Tracking shortlist for request ${requestId} by user ${userId}`);
            
            // Get current request to check if it exists
            const request = await this.db.findOne('requests', { id: requestId, isdeleted: false });
            if (!request) {
                return { success: false, error: "Request not found" };
            }
            
            // Increment shortlist count
            const currentShortlistCount = request.shortlistcount || 0;
            const newShortlistCount = currentShortlistCount + 1;
            
            // Update the shortlist count in the database
            await this.db.update('requests', 
                { id: requestId }, 
                { shortlistcount: newShortlistCount }
            );
            
            console.log(`Shortlist count updated: ${currentShortlistCount} → ${newShortlistCount}`);
            
            return {
                success: true,
                message: "Shortlist count incremented successfully",
                data: {
                    requestId: requestId,
                    userId: userId,
                    shortlistCount: newShortlistCount,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            console.error('Track shortlist error:', error);
            return { success: false, error: "Failed to track shortlist" };
        }
    }

    // ========================================
    // GET VIEW COUNT
    // ========================================
    
    getViewCount(requestId) {
        try {
            const request = db.findOne('requests', { id: requestId, isDeleted: false });
            
            if (!request) {
                return { success: false, error: "Request not found" };
            }

            return {
                success: true,
                data: {
                    requestId: requestId,
                    viewCount: request.viewcount || 0
                }
            };
        } catch (error) {
            return { success: false, error: "Failed to get view count" };
        }
    }

    // ========================================
    // GET SHORTLIST COUNT
    // ========================================
    
    getShortlistCount(requestId) {
        try {
            const request = db.findOne('requests', { id: requestId, isDeleted: false });
            
            if (!request) {
                return { success: false, error: "Request not found" };
            }

            return {
                success: true,
                data: {
                    requestId: requestId,
                    shortlistCount: request.shortlistcount || 0
                }
            };
        } catch (error) {
            return { success: false, error: "Failed to get shortlist count" };
        }
    }

}

module.exports = Request;
