const Category = require('../entity/Category');

class UpdateCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async updateCategory(data) {
        console.log("UpdateCategoryController: Processing category update...");
        console.log("Update data received:", data);
        
        // Extract categoryId and prepare updateData
        const { categoryId, newName, ...otherData } = data;
        
        if (!categoryId) {
            return {
                success: false,
                error: "Category ID is required"
            };
        }
        
        // Map newName to name for the entity
        const updateData = {
            ...otherData,
            ...(newName && { name: newName })
        };
        
        console.log("Mapped update data:", updateData);
        
        // Call entity's updateCategory method with correct parameters
        return await this.entity.updateCategory(categoryId, updateData);
    }
}

module.exports = UpdateCategoryController;

