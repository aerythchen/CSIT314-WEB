class SearchOpportunityEntity {
    constructor() {
        this.searchData = null;
        this.searchResults = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchOpportunityEntity: Initializing...");
        this.searchData = {
            searchTerm: "",
            category: "",
            location: "",
            timestamp: new Date().toISOString(),
            userId: null
        };
        this.searchResults = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchOpportunityEntity: Validating data...");
        
        if (!data) {
            return {
                isValid: false,
                error: "Data is required"
            };
        }

        // Validate searchTerm if provided
        if (data.searchTerm && typeof data.searchTerm !== 'string') {
            return {
                isValid: false,
                error: "Search term must be a string"
            };
        }

        // Validate category if provided
        if (data.category && typeof data.category !== 'string') {
            return {
                isValid: false,
                error: "Category must be a string"
            };
        }

        // Validate location if provided
        if (data.location && typeof data.location !== 'string') {
            return {
                isValid: false,
                error: "Location must be a string"
            };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchOpportunityEntity: Processing data...");
        
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
            searchTerm: data.searchTerm || "",
            category: data.category || "",
            location: data.location || "",
            timestamp: new Date().toISOString(),
            userId: data.userId || null
        };

        // Store search results if provided
        if (data.results) {
            this.searchResults = data.results;
        }

        console.log("Data processed successfully");
        return {
            success: true,
            message: "Search data processed",
            data: this.searchData
        };
    }

    getData() {
        console.log("SearchOpportunityEntity: Retrieving data...");
        
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

module.exports = SearchOpportunityEntity;

