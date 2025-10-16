const CSRRepresentative = require('../entity/CSRRepresentative');

class SearchHistoryController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    searchHistory(data) {
        const { userId, serviceType, startDate, endDate } = data;
        
        console.log(`SearchHistoryController: Searching history for user ${userId}...`);
        
        // Create date range object
        const dateRange = (startDate || endDate) ? { from: startDate, to: endDate } : null;
        
        // Validate search parameters
        const validationResult = this.validateHistorySearch(userId, dateRange, serviceType);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search
        return this.processHistorySearch(userId, dateRange, serviceType);
    }

    validateHistorySearch(userId, dateRange, serviceType) {
        console.log("Validating history search parameters...");
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }
        
        // Validate date range if provided
        if (dateRange) {
            if (dateRange.from && dateRange.to) {
                const fromDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);
                
                if (fromDate > toDate) {
                    return {
                        isValid: false,
                        error: "Start date cannot be after end date"
                    };
                }
            }
        }
        
        return { isValid: true };
    }

    processHistorySearch(userId, dateRange, serviceType) {
        console.log("Processing history search...");
        
        // Use consolidated entity method directly
        const result = this.entity.searchHistory(serviceType, dateRange?.from, dateRange?.to);
        
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                results: []
            };
        }
        
        return {
            success: true,
            data: result.data,
            count: result.count
        };
    }
}

module.exports = SearchHistoryController;

