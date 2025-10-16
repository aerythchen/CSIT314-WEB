const DeleteCategoryEntity = require('../entity/platformmanager_deletecategory');

class DeleteCategoryController {
    constructor() {
        this.entity = new DeleteCategoryEntity();
        this.entity.initialize();
    }

    deleteCategory(categoryId) {
        console.log("DeleteCategoryController: Processing category deletion...");
        
        // Validate delete action
        const validationResult = this.validateDeleteAction(categoryId);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                category: null
            };
        }
        
        // Process category deletion
        return this.processDeleteAction(categoryId);
    }

    validateDeleteAction(categoryId) {
        console.log("Validating delete action...");
        
        // Check if category ID is provided
        if (!categoryId || categoryId.trim() === "") {
            return {
                isValid: false,
                error: "Category ID is required"
            };
        }
        
        // Validate ID format
        if (typeof categoryId !== 'string') {
            return {
                isValid: false,
                error: "Category ID must be a string"
            };
        }
        
        // Additional business rules validation
        // In real app, check if category has active requests
        // In real app, check if category is system-protected
        
        return { isValid: true };
    }

    processDeleteAction(categoryId) {
        console.log(`Processing deletion for category: ${categoryId}...`);
        
        // Use Entity to delete category (soft delete)
        const entityResult = this.entity.process({
            categoryId: categoryId.trim(),
            deletedBy: "platformmanager"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                category: null
            };
        }
        
        // Get deleted category data
        const categoryData = this.entity.getData();
        
        console.log(`Category deleted successfully: ${categoryData.data.name}`);
        
        return {
            success: true,
            category: categoryData.data,
            message: "Category deleted successfully"
        };
    }
}

module.exports = DeleteCategoryController;

