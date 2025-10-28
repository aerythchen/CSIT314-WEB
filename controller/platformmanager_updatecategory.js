const Category = require('../entity/Category');

class UpdateCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async updateCategory(data) {
        console.log("UpdateCategoryController: Processing category update...");
        console.log("Update data received:", data);
        
        // Extract categoryId and prepare updateData
        const { categoryId, ...updateData } = data;
        
        if (!categoryId) {
            return {
                success: false,
                error: "Category ID is required"
            };
        }
        
        // Call entity's updateCategory method with correct parameters
        return await this.entity.updateCategory(categoryId, updateData);
    }
}

module.exports = UpdateCategoryController;

