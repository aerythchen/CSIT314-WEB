class SearchHistoryEntity {
    constructor() {
        this.searchData = null;
        this.searchResults = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchHistoryEntity: Initializing...");
        this.searchData = {
            userId: null,
            searchTerm: "",
            dateRange: {
                from: null,
                to: null
            },
            serviceType: "All",
            timestamp: new Date().toISOString()
        };
        this.searchResults = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchHistoryEntity: Validating data...");
        
        if (!data) {
            return {
                isValid: false,
                error: "Data is required"
            };
        }

        // Validate user ID
        if (!data.userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }

        // Validate date range if provided
        if (data.dateRange) {
            if (data.dateRange.from && data.dateRange.to) {
                const fromDate = new Date(data.dateRange.from);
                const toDate = new Date(data.dateRange.to);
                
                if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
                    return {
                        isValid: false,
                        error: "Invalid date format"
                    };
                }
                
                if (fromDate > toDate) {
                    return {
                        isValid: false,
                        error: "Start date cannot be after end date"
                    };
                }
            }
        }

        // Validate serviceType if provided
        const validServiceTypes = ["All", "View", "Shortlist", "Application", "Search"];
        if (data.serviceType && !validServiceTypes.includes(data.serviceType)) {
            return {
                isValid: false,
                error: "Invalid service type"
            };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchHistoryEntity: Processing data...");
        
        // Validate before processing
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Store search criteria
        this.searchData = {
            userId: data.userId,
            searchTerm: data.searchTerm || "",
            dateRange: {
                from: data.dateRange?.from || null,
                to: data.dateRange?.to || null
            },
            serviceType: data.serviceType || "All",
            timestamp: new Date().toISOString()
        };

        // Store search results if provided
        if (data.results && Array.isArray(data.results)) {
            this.searchResults = data.results.map(record => ({
                id: record.id,
                action: record.action,
                opportunityTitle: record.opportunityTitle,
                date: record.date,
                time: record.time,
                serviceType: record.serviceType,
                duration: record.duration || null,
                additionalInfo: record.additionalInfo || ""
            }));
        }

        console.log("History search data processed successfully");
        return {
            success: true,
            message: "History search data processed",
            data: this.searchData
        };
    }

    getData() {
        console.log("SearchHistoryEntity: Retrieving data...");
        
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
                searchCriteria: this.searchData,
                results: this.searchResults,
                resultCount: this.searchResults.length
            }
        };
    }
}

module.exports = SearchHistoryEntity;

