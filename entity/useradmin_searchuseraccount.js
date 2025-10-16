const { db } = require('../database');

class SearchUserAccountEntity {
    constructor() {
        this.accounts = [];
        this.searchCriteria = {};
        this.isInitialized = false;
    }

    initialize() {
        console.log("SearchUserAccountEntity: Initializing...");
        this.accounts = [];
        this.searchCriteria = {};
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SearchUserAccountEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validStatuses = ["all", "active", "inactive", "locked"];
        if (data.status && !validStatuses.includes(data.status)) {
            return { isValid: false, error: "Invalid status" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SearchUserAccountEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        this.searchCriteria = {
            searchTerm: data.searchTerm || "",
            status: data.status || "all"
        };

        // Build search criteria
        let criteria = { isDeleted: false };
        
        if (data.status && data.status !== 'all') {
            criteria.status = data.status;
        }

        // Perform search
        if (data.searchTerm && data.searchTerm.trim()) {
            this.accounts = db.searchMultipleFields('userAccounts',
                ['username', 'id'],
                data.searchTerm,
                criteria
            );
        } else {
            this.accounts = db.find('userAccounts', criteria);
        }

        console.log(`Search executed: ${this.accounts.length} results`);
        return {
            success: true,
            message: "Search completed",
            count: this.accounts.length
        };
    }

    getData() {
        console.log("SearchUserAccountEntity: Retrieving data...");
        
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
                accounts: this.accounts,
                count: this.accounts.length,
                searchCriteria: this.searchCriteria
            }
        };
    }
}

module.exports = SearchUserAccountEntity;
