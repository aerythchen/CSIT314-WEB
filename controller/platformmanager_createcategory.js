const Category = require('../entity/Category');

class CreateCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async createCategory(data) {
        console.log("CreateCategoryController: Processing category creation...");
        
        // Call entity's createCategory method
        return await this.entity.createCategory(data);
    }
}

module.exports = CreateCategoryController;

