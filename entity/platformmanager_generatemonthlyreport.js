const { db } = require('../database');

class GenerateMonthlyReportEntity {
    constructor() {
        this.report = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("GenerateMonthlyReportEntity: Initializing...");
        this.report = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("GenerateMonthlyReportEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.month || typeof data.month !== 'number') {
            return { isValid: false, error: "Valid month is required" };
        }

        if (!data.year || typeof data.year !== 'number') {
            return { isValid: false, error: "Valid year is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("GenerateMonthlyReportEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        const month = data.month;
        const year = data.year;
        
        // Calculate month boundaries
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        lastDay.setHours(23, 59, 59, 999);

        // Query database for monthly statistics
        const requests = db.find('requests', { isDeleted: false });
        const profiles = db.find('userProfiles', { isDeleted: false });
        const sessions = db.find('sessions', {});
        const categories = db.find('categories', { isDeleted: false });
        
        // Filter by month
        const monthlyRequests = requests.filter(r => {
            const createdDate = new Date(r.createdAt);
            return createdDate >= firstDay && createdDate <= lastDay;
        });

        const monthlySessions = sessions.filter(s => {
            const sessionDate = new Date(s.createdAt);
            return sessionDate >= firstDay && sessionDate <= lastDay;
        });

        const monthlyUsers = profiles.filter(p => {
            const createdDate = new Date(p.createdAt);
            return createdDate >= firstDay && createdDate <= lastDay;
        });

        // Calculate statistics
        const statistics = {
            totalRequests: monthlyRequests.length,
            approvedRequests: monthlyRequests.filter(r => r.status === 'approved').length,
            pendingRequests: monthlyRequests.filter(r => r.status === 'pending').length,
            rejectedRequests: monthlyRequests.filter(r => r.status === 'rejected').length,
            totalUsers: profiles.length,
            newUsers: monthlyUsers.length,
            activeUsers: monthlySessions.length,
            totalCategories: categories.length
        };

        // Calculate analysis
        const analysis = {
            approvalRate: statistics.totalRequests > 0 ? 
                (statistics.approvedRequests / statistics.totalRequests * 100).toFixed(2) : 0,
            userGrowthRate: profiles.length > 0 ?
                (monthlyUsers.length / profiles.length * 100).toFixed(2) : 0,
            averageRequestsPerUser: monthlyUsers.length > 0 ?
                (monthlyRequests.length / monthlyUsers.length).toFixed(2) : 0
        };

        // Calculate top performers (most active categories)
        const categoryStats = {};
        monthlyRequests.forEach(r => {
            if (r.categoryId) {
                categoryStats[r.categoryId] = (categoryStats[r.categoryId] || 0) + 1;
            }
        });

        const topPerformers = Object.entries(categoryStats)
            .map(([categoryId, count]) => {
                const category = db.findById('categories', categoryId);
                return {
                    categoryId,
                    categoryName: category ? category.name : 'Unknown',
                    requestCount: count
                };
            })
            .sort((a, b) => b.requestCount - a.requestCount)
            .slice(0, 5);

        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[month - 1];

        const now = new Date().toISOString();
        const reportId = `report_monthly_${Date.now()}`;

        this.report = {
            id: reportId,
            reportType: "monthly",
            month: month,
            monthName: monthName,
            year: year,
            periodStart: firstDay.toISOString(),
            periodEnd: lastDay.toISOString(),
            statistics: statistics,
            analysis: analysis,
            topPerformers: topPerformers,
            data: {
                requests: monthlyRequests,
                sessions: monthlySessions,
                newUsers: monthlyUsers
            },
            generatedAt: now,
            generatedBy: data.generatedBy || "platformmanager"
        };

        // Create audit log
        db.insert('auditLogs', {
            action: 'GENERATE_MONTHLY_REPORT',
            entityType: 'report',
            entityId: this.report.id,
            performedBy: data.generatedBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: {
                month: monthName,
                year: year,
                totalRequests: statistics.totalRequests
            }
        });

        console.log("Monthly report generated successfully");
        return {
            success: true,
            message: "Monthly report generated",
            data: {
                id: this.report.id,
                month: this.report.month,
                year: this.report.year
            }
        };
    }

    getData() {
        console.log("GenerateMonthlyReportEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.report
        };
    }
}

module.exports = GenerateMonthlyReportEntity;
