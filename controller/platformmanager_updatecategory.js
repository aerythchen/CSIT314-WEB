const Category = require('../entity/Category');

class UpdateCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async updateCategory(data) {
        console.log("UpdateCategoryController: Processing category update...");
        
        // Call entity's updateCategory method
        return await this.entity.updateCategory(data);
    }
}

module.exports = UpdateCategoryController;

