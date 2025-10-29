const SearchCategoryController = require('../controller/platformmanager_searchcategory');

class PlatformmanagerSearchcategoryBoundary {
    constructor() {
        this.controller = new SearchCategoryController();
    }

    async handleSearchCategory(data) {
        // Call controller and return result directly
        return await this.controller.searchCategory(data);
    }
}

module.exports = PlatformmanagerSearchcategoryBoundary;
