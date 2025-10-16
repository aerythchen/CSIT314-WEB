const SearchUserAccountEntity = require('../entity/useradmin_searchuseraccount');

class SearchUserAccountController {
    constructor() {
        this.entity = new SearchUserAccountEntity();
        this.entity.initialize();
    }

    searchUserAccount(searchTerm, status) {
        console.log("SearchUserAccountController: Processing search request...");
        
        const validationResult = this.validateSearchCriteria(searchTerm, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                accounts: []
            };
        }
        
        return this.processSearchRequest(searchTerm, status);
    }

    searchUserAccounts(searchTerm, status) {
        return this.searchUserAccount(searchTerm, status);
    }

    validateSearchCriteria(searchTerm, status) {
        console.log("Validating search criteria...");
        
        const validStatuses = ["all", "active", "inactive", "locked"];
        if (status && !validStatuses.includes(status)) {
            return { isValid: false, error: "Invalid status filter" };
        }
        
        if (searchTerm && searchTerm.length > 100) {
            return { isValid: false, error: "Search term too long (max 100 characters)" };
        }
        
        return { isValid: true };
    }

    processSearchRequest(searchTerm, status) {
        console.log("Processing search...");
        
        const entityResult = this.entity.process({
            searchTerm: searchTerm ? searchTerm.trim() : "",
            status: status || "all"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                accounts: []
            };
        }
        
        const searchData = this.entity.getData();
        
        console.log(`Search completed: ${searchData.data.accounts.length} results`);
        
        return {
            success: true,
            accounts: searchData.data.accounts,
            count: searchData.data.count
        };
    }
}

module.exports = SearchUserAccountController;

