const { db } = require('../database');

class GenerateWeeklyReportEntity {
    constructor() {
        this.report = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("GenerateWeeklyReportEntity: Initializing...");
        this.report = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("GenerateWeeklyReportEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.startDate || typeof data.startDate !== 'string') {
            return { isValid: false, error: "Valid start date is required" };
        }

        if (!data.endDate || typeof data.endDate !== 'string') {
            return { isValid: false, error: "Valid end date is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    getWeekNumber(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    process(data) {
        console.log("GenerateWeeklyReportEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        // Query database for weekly statistics
        const requests = db.find('requests', { isDeleted: false });
        const profiles = db.find('userProfiles', { isDeleted: false });
        const sessions = db.find('sessions', {});
        
        // Filter by week
        const weeklyRequests = requests.filter(r => {
            const createdDate = new Date(r.createdAt);
            return createdDate >= startDate && createdDate <= endDate;
        });

        const weeklySessions = sessions.filter(s => {
            const sessionDate = new Date(s.createdAt);
            return sessionDate >= startDate && sessionDate <= endDate;
        });

        // Calculate statistics
        const statistics = {
            totalRequests: weeklyRequests.length,
            approvedRequests: weeklyRequests.filter(r => r.status === 'approved').length,
            pendingRequests: weeklyRequests.filter(r => r.status === 'pending').length,
            rejectedRequests: weeklyRequests.filter(r => r.status === 'rejected').length,
            totalUsers: profiles.length,
            activeUsers: weeklySessions.length,
            newUsers: profiles.filter(p => {
                const createdDate = new Date(p.createdAt);
                return createdDate >= startDate && createdDate <= endDate;
            }).length
        };

        // Calculate trends
        const trends = {
            requestGrowth: "N/A",
            userGrowth: statistics.newUsers,
            approvalRate: statistics.totalRequests > 0 ? 
                (statistics.approvedRequests / statistics.totalRequests * 100).toFixed(2) : 0
        };

        const now = new Date().toISOString();
        const reportId = `report_weekly_${Date.now()}`;
        const weekNumber = this.getWeekNumber(startDate);
        const year = startDate.getFullYear();

        this.report = {
            id: reportId,
            reportType: "weekly",
            weekNumber: weekNumber,
            year: year,
            periodStart: startDate.toISOString(),
            periodEnd: endDate.toISOString(),
            statistics: statistics,
            trends: trends,
            data: {
                requests: weeklyRequests,
                sessions: weeklySessions
            },
            generatedAt: now,
            generatedBy: data.generatedBy || "platformmanager"
        };

        // Create audit log
        db.insert('auditLogs', {
            action: 'GENERATE_WEEKLY_REPORT',
            entityType: 'report',
            entityId: this.report.id,
            performedBy: data.generatedBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: {
                weekNumber: weekNumber,
                year: year,
                totalRequests: statistics.totalRequests
            }
        });

        console.log("Weekly report generated successfully");
        return {
            success: true,
            message: "Weekly report generated",
            data: {
                id: this.report.id,
                periodStart: this.report.periodStart,
                periodEnd: this.report.periodEnd
            }
        };
    }

    getData() {
        console.log("GenerateWeeklyReportEntity: Retrieving data...");
        
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

module.exports = GenerateWeeklyReportEntity;
