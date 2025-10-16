const { db } = require('../database');

class SearchReportEntity {
    constructor() {
        this.reports = [];
        this.searchCriteria = {};
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchReportEntity: Initializing...");
        this.reports = [];
        this.searchCriteria = {};
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchReportEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validReportTypes = ["all", "daily", "weekly", "monthly", "activity", "user"];
        if (data.reportType && !validReportTypes.includes(data.reportType)) {
            return { isValid: false, error: "Invalid report type" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchReportEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        this.searchCriteria = {
            searchTerm: data.searchTerm || "",
            reportType: data.reportType || "all",
            dateFrom: data.dateFrom || null,
            dateTo: data.dateTo || null
        };

        // Build search criteria for audit logs (reports are stored as audit logs)
        let criteria = { 
            action: (action) => action.includes('REPORT') || action.includes('GENERATE')
        };

        // Filter by report type if specified
        if (data.reportType && data.reportType !== 'all') {
            criteria.action = (action) => action.includes(data.reportType.toUpperCase());
        }

        // Perform search
        if (data.searchTerm && data.searchTerm.trim()) {
            // Search in audit logs
            this.reports = db.searchMultipleFields('auditLogs',
                ['action', 'entityType'],
                data.searchTerm,
                criteria
            );
        } else {
            this.reports = db.find('auditLogs', criteria);
        }

        // Filter by date range if provided
        if (data.dateFrom && data.dateTo) {
            this.reports = db.findByDateRange('auditLogs',
                'timestamp',
                data.dateFrom,
                data.dateTo,
                criteria
            );
        }

        console.log(`Search executed: ${this.reports.length} results`);
        return {
            success: true,
            message: "Search completed",
            count: this.reports.length
        };
    }

    getData() {
        console.log("SearchReportEntity: Retrieving data...");
        
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
                reports: this.reports,
                count: this.reports.length,
                searchCriteria: this.searchCriteria
            }
        };
    }
}

module.exports = SearchReportEntity;
