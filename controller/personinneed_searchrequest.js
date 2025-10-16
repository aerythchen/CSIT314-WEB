const SearchRequestEntity = require('../entity/PersonInNeed');

class SearchRequestController {
    constructor() {
        this.entity = new PersonInNeed();
        this.entity.initialize();
    }

    searchRequest(data) {
        console.log("SearchRequestController: Processing search request...");
        
        // Validate search criteria
        const validationResult = this.validateSearchCriteria(userId, searchTerm, status, dateRange);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                results: []
            };
        }
        
        // Process the search
        return this.processSearchRequest(userId, searchTerm, status, dateRange);
    }

    validateSearchCriteria(userId, searchTerm, status, dateRange) {
        console.log("Validating search criteria...");
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }
        
        // Validate search term length if provided
        if (searchTerm && searchTerm.trim().length < 2) {
            return {
                isValid: false,
                error: "Search term must be at least 2 characters"
            };
        }
        
        // Validate status if provided
        if (status && status !== "All") {
            const validStatuses = ["Pending", "In Progress", "Fulfilled", "Cancelled"];
            if (!validStatuses.includes(status)) {
                return {
                    isValid: false,
                    error: "Invalid status filter"
                };
            }
        }
        
        // Validate date range if provided
        if (dateRange && dateRange.from && dateRange.to) {
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            
            if (fromDate > toDate) {
                return {
                    isValid: false,
                    error: "Start date cannot be after end date"
                };
            }
        }
        
        return { isValid: true };
    }

    processSearchRequest(userId, searchTerm, status, dateRange) {
        console.log("Processing search with filters:", { searchTerm, status, dateRange });
        
        // Use Entity to search requests
        const entityResult = this.entity.process({
            userId: userId,
            searchTerm: searchTerm,
            status: status,
            dateRange: dateRange
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

module.exports = SearchRequestController;

