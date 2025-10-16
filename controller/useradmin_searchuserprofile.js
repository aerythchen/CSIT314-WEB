const SearchUserProfileEntity = require('../entity/useradmin_searchuserprofile');

class SearchUserProfileController {
    constructor() {
        this.entity = new SearchUserProfileEntity();
        this.entity.initialize();
    }

    searchUserProfile(searchTerm, userType, status) {
        console.log("SearchUserProfileController: Processing search request...");
        
        const validationResult = this.validateSearchCriteria(searchTerm, userType, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                profiles: []
            };
        }
        
        return this.processSearchRequest(searchTerm, userType, status);
    }

    searchUserProfiles(searchTerm, userType, status) {
        return this.searchUserProfile(searchTerm, userType, status);
    }

    validateSearchCriteria(searchTerm, userType, status) {
        console.log("Validating search criteria...");
        
        const validUserTypes = ["all", "csrrepresentative", "personinneed", "platformmanager", "useradmin"];
        if (userType && !validUserTypes.includes(userType)) {
            return { isValid: false, error: "Invalid user type filter" };
        }
        
        const validStatuses = ["all", "active", "suspended", "inactive"];
        if (status && !validStatuses.includes(status)) {
            return { isValid: false, error: "Invalid status filter" };
        }
        
        if (searchTerm && searchTerm.length > 100) {
            return { isValid: false, error: "Search term too long (max 100 characters)" };
        }
        
        return { isValid: true };
    }

    processSearchRequest(searchTerm, userType, status) {
        console.log("Processing search...");
        
        const entityResult = this.entity.process({
            searchTerm: searchTerm ? searchTerm.trim() : "",
            userType: userType || "all",
            status: status || "all"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profiles: []
            };
        }
        
        const searchData = this.entity.getData();
        
        console.log(`Search completed: ${searchData.data.profiles.length} results`);
        
        return {
            success: true,
            profiles: searchData.data.profiles,
            count: searchData.data.count
        };
    }
}

module.exports = SearchUserProfileController;

