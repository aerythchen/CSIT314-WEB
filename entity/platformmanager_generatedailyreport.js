const { db } = require('../database');

class GenerateDailyReportEntity {
    constructor() {
        this.report = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("GenerateDailyReportEntity: Initializing...");
        this.report = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("GenerateDailyReportEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.reportDate || typeof data.reportDate !== 'string') {
            return { isValid: false, error: "Valid report date is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("GenerateDailyReportEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        const reportDate = new Date(data.reportDate);
        const reportDateStr = reportDate.toISOString().split('T')[0];
        
        // Set period boundaries
        const periodStart = new Date(reportDate.setHours(0, 0, 0, 0));
        const periodEnd = new Date(reportDate.setHours(23, 59, 59, 999));

        // Query database for daily statistics
        const requests = db.find('requests', { isDeleted: false });
        const profiles = db.find('userProfiles', { isDeleted: false });
        const sessions = db.find('sessions', {});
        
        // Filter by date
        const dailyRequests = requests.filter(r => {
            const createdDate = new Date(r.createdAt);
            return createdDate >= periodStart && createdDate <= periodEnd;
        });

        const dailySessions = sessions.filter(s => {
            const sessionDate = new Date(s.createdAt);
            return sessionDate >= periodStart && sessionDate <= periodEnd;
        });

        // Calculate statistics
        const statistics = {
            totalRequests: dailyRequests.length,
            approvedRequests: dailyRequests.filter(r => r.status === 'approved').length,
            pendingRequests: dailyRequests.filter(r => r.status === 'pending').length,
            rejectedRequests: dailyRequests.filter(r => r.status === 'rejected').length,
            totalUsers: profiles.length,
            activeUsers: dailySessions.length
        };

        // Calculate metrics
        const metrics = {
            approvalRate: statistics.totalRequests > 0 ? 
                (statistics.approvedRequests / statistics.totalRequests * 100).toFixed(2) : 0,
            averageResponseTime: "N/A",
            userEngagementRate: profiles.length > 0 ?
                (dailySessions.length / profiles.length * 100).toFixed(2) : 0
        };

        const now = new Date().toISOString();
        const reportId = `report_daily_${Date.now()}`;

        this.report = {
            id: reportId,
            reportType: "daily",
            reportDate: reportDateStr,
            periodStart: periodStart.toISOString(),
            periodEnd: periodEnd.toISOString(),
            statistics: statistics,
            metrics: metrics,
            data: {
                requests: dailyRequests,
                sessions: dailySessions
            },
            generatedAt: now,
            generatedBy: data.generatedBy || "platformmanager"
        };

        // Create audit log
        db.insert('auditLogs', {
            action: 'GENERATE_DAILY_REPORT',
            entityType: 'report',
            entityId: this.report.id,
            performedBy: data.generatedBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: {
                reportDate: reportDateStr,
                totalRequests: statistics.totalRequests
            }
        });

        console.log("Daily report generated successfully");
        return {
            success: true,
            message: "Daily report generated",
            data: {
                id: this.report.id,
                reportDate: this.report.reportDate
            }
        };
    }

    getData() {
        console.log("GenerateDailyReportEntity: Retrieving data...");
        
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

module.exports = GenerateDailyReportEntity;
