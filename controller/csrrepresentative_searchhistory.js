const SearchHistoryEntity = require('../entity/csrrepresentative_searchhistory');

class SearchHistoryController {
    constructor() {
        this.entity = new SearchHistoryEntity();
        this.entity.initialize();
    }

    searchHistory(userId, searchTerm, dateRange, serviceType) {
        console.log(`SearchHistoryController: Searching history for user ${userId}...`);
        
        // Validate search parameters
        const validationResult = this.validateHistorySearch(userId, searchTerm, dateRange, serviceType);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search
        return this.processHistorySearch(userId, searchTerm, dateRange, serviceType);
    }

    validateHistorySearch(userId, searchTerm, dateRange, serviceType) {
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

    processHistorySearch(userId, searchTerm, dateRange, serviceType) {
        console.log("Processing history search...");
        
        // Use Entity to search history
        const entityResult = this.entity.process({
            userId: userId,
            searchTerm: searchTerm,
            dateRange: dateRange,
            serviceType: serviceType
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                results: []
            };
        }
        
        // Get stored data
        const searchData = this.entity.getData();
        
        return {
            success: true,
            results: searchData.data.results,
            count: searchData.data.resultCount
        };
    }
}

module.exports = SearchHistoryController;

