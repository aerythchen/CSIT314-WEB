const Category = require('../entity/Category');

class SearchCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async searchCategory(data) {
        const { searchTerm } = data;
        console.log("SearchCategoryController: Processing category search...");
        
        // Use Entity to search categories
        return await this.entity.searchCategories(searchTerm);
    }
}

module.exports = SearchCategoryController;
