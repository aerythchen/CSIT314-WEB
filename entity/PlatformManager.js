const { db } = require('../database');
const { CategoryHelpers, SessionHelpers } = require('../database/helpers');

/**
 * PlatformManager Entity - Consolidated entity for all Platform Manager operations
 */
class PlatformManager {
    constructor() {
        this.db = db;
        this.user = null;
        this.session = null;
    }

    // ========================================
    // LOGIN OPERATIONS
    // ========================================
    
    login(email, password) {
        const profile = db.findOne('userProfiles', { 
            email: email, 
            userType: 'platformmanager',
            isDeleted: false 
        });

        if (!profile) {
            return { success: false, error: "Invalid email or password" };
        }

        // Validate password (in production, this would use bcrypt)
        if (profile.password !== password) {
            return { success: false, error: "Invalid email or password" };
        }

        if (profile.status === 'suspended') {
            return { success: false, error: "Account is suspended" };
        }

        const account = db.findOne('userAccounts', { 
            profileId: profile.id,
            isDeleted: false 
        });

        if (!account) {
            return { success: false, error: "Invalid email or password" };
        }

        if (account.status === 'locked') {
            return { success: false, error: "Account is locked" };
        }

        db.update('userAccounts', account.id, {
            lastLogin: new Date().toISOString(),
            loginAttempts: 0
        });

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const sessionResult = SessionHelpers.createSession({
            token: sessionToken,
            accountId: account.id,
            profileId: profile.id,
            userId: profile.id,
            userType: 'platformmanager',
            role: 'manager',
            status: 'active',
            expiresAt: expiresAt.toISOString()
        });

        if (!sessionResult.success) {
            return sessionResult;
        }

        this.user = {
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            userType: profile.userType,
            role: 'manager',
            permissions: ['manage_categories', 'generate_reports', 'view_analytics']
        };

        this.session = sessionResult.data;

        return {
            success: true,
            message: "Login successful",
            data: {
                user: this.user,
                session: this.session
            }
        };
    }

    logout(sessionToken) {
        if (!sessionToken) {
            return { success: false, error: "Session token required" };
        }

        const result = SessionHelpers.deleteSession(sessionToken);
        
        if (result.success) {
            this.user = null;
            this.session = null;
        }

        return result;
    }

    // ========================================
    // CATEGORY OPERATIONS
    // ========================================
    
    createCategory(name, description, icon) {
        const result = CategoryHelpers.create({
            name: name.trim(),
            description: description ? description.trim() : '',
            icon: icon || 'folder',
            requestCount: 0,
            createdAt: new Date().toISOString()
        });

        return result;
    }

    viewCategories() {
        const categories = CategoryHelpers.findAll({ isDeleted: false });

        return {
            success: true,
            data: categories,
            count: categories.length
        };
    }

    viewCategory(categoryId) {
        const category = CategoryHelpers.findOne({ 
            id: categoryId,
            isDeleted: false 
        });

        if (!category) {
            return { success: false, error: "Category not found" };
        }

        return {
            success: true,
            data: category
        };
    }

    updateCategory(categoryId, name, description, icon) {
        const category = CategoryHelpers.findOne({ 
            id: categoryId,
            isDeleted: false 
        });

        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (icon) updateData.icon = icon;
        updateData.updatedAt = new Date().toISOString();

        const result = CategoryHelpers.update(categoryId, updateData);
        return result;
    }

    deleteCategory(categoryId) {
        const category = CategoryHelpers.findOne({ 
            id: categoryId,
            isDeleted: false 
        });

        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const result = CategoryHelpers.delete(categoryId);
        return result;
    }

    // ========================================
    // REPORT OPERATIONS
    // ========================================
    
    generateDailyReport(date) {
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const requests = db.findAll('requests', { isDeleted: false });
        const dailyRequests = requests.filter(r => {
            const createdAt = new Date(r.createdAt);
            return createdAt >= startOfDay && createdAt <= endOfDay;
        });

        return {
            success: true,
            data: {
                type: 'daily',
                date: targetDate.toISOString().split('T')[0],
                totalRequests: dailyRequests.length,
                requests: dailyRequests
            }
        };
    }

    generateWeeklyReport(startDate) {
        const start = startDate ? new Date(startDate) : new Date();
        const end = new Date(start);
        end.setDate(end.getDate() + 7);

        const requests = db.findAll('requests', { isDeleted: false });
        const weeklyRequests = requests.filter(r => {
            const createdAt = new Date(r.createdAt);
            return createdAt >= start && createdAt <= end;
        });

        return {
            success: true,
            data: {
                type: 'weekly',
                startDate: start.toISOString().split('T')[0],
                endDate: end.toISOString().split('T')[0],
                totalRequests: weeklyRequests.length,
                requests: weeklyRequests
            }
        };
    }

    generateMonthlyReport(month, year) {
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || new Date().getMonth();
        const start = new Date(targetYear, targetMonth, 1);
        const end = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

        const requests = db.findAll('requests', { isDeleted: false });
        const monthlyRequests = requests.filter(r => {
            const createdAt = new Date(r.createdAt);
            return createdAt >= start && createdAt <= end;
        });

        return {
            success: true,
            data: {
                type: 'monthly',
                month: targetMonth + 1,
                year: targetYear,
                totalRequests: monthlyRequests.length,
                requests: monthlyRequests
            }
        };
    }

    searchReports(reportType, startDate, endDate) {
        // Placeholder - in a real system, reports would be stored
        return {
            success: true,
            data: {
                reportType: reportType,
                startDate: startDate,
                endDate: endDate,
                message: "Report search feature"
            }
        };
    }
}

module.exports = PlatformManager;

