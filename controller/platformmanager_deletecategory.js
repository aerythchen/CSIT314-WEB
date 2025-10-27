const Category = require('../entity/Category');

class DeleteCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async deleteCategory(data) {
        console.log("DeleteCategoryController: Processing category deletion...");
        
        // Call entity's deleteCategory method
        return await this.entity.deleteCategory(data.categoryId);
    }
}

module.exports = DeleteCategoryController;

