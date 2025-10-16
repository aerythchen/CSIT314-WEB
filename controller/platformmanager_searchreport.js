const SearchReportEntity = require('../entity/platformmanager_searchreport');

class SearchReportController {
    constructor() {
        this.entity = new SearchReportEntity();
        this.entity.initialize();
    }

    searchReport(searchTerm, reportType, dateFrom, dateTo) {
        console.log("SearchReportController: Processing report search...");
        
        // Validate search criteria
        const validationResult = this.validateSearchCriteria(searchTerm, reportType, dateFrom, dateTo);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                reports: []
            };
        }
        
        // Process search request
        return this.processSearchRequest(searchTerm, reportType, dateFrom, dateTo);
    }

    validateSearchCriteria(searchTerm, reportType, dateFrom, dateTo) {
        console.log("Validating search criteria...");
        
        // Validate report type if provided
        if (reportType) {
            const validTypes = ["all", "daily", "weekly", "monthly", "activity", "user"];
            if (!validTypes.includes(reportType.toLowerCase())) {
                return {
                    isValid: false,
                    error: "Invalid report type. Must be one of: all, daily, weekly, monthly, activity, user"
                };
            }
        }
        
        // Validate search term if provided
        if (searchTerm && typeof searchTerm !== 'string') {
            return {
                isValid: false,
                error: "Search term must be a string"
            };
        }
        
        // Validate date format if provided
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            if (isNaN(fromDate.getTime())) {
                return {
                    isValid: false,
                    error: "Invalid 'from' date format"
                };
            }
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            if (isNaN(toDate.getTime())) {
                return {
                    isValid: false,
                    error: "Invalid 'to' date format"
                };
            }
        }
        
        // Validate date range logic
        if (dateFrom && dateTo) {
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            if (fromDate > toDate) {
                return {
                    isValid: false,
                    error: "'From' date cannot be after 'To' date"
                };
            }
        }
        
        return { isValid: true };
    }

    processSearchRequest(searchTerm, reportType, dateFrom, dateTo) {
        console.log("Processing search request...");
        
        // Prepare search criteria
        const searchCriteria = {
            searchTerm: searchTerm?.trim() || null,
            reportType: reportType?.toLowerCase() || "all",
            dateFrom: dateFrom || null,
            dateTo: dateTo || null
        };
        
        // Use Entity to search reports
        const entityResult = this.entity.process(searchCriteria);
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                reports: []
            };
        }
        
        // Get search results
        const searchData = this.entity.getData();
        
        console.log(`Found ${searchData.data.reports.length} reports matching criteria`);
        
        return {
            success: true,
            reports: searchData.data.reports,
            count: searchData.data.count,
            searchCriteria: searchCriteria
        };
    }
}

module.exports = SearchReportController;

