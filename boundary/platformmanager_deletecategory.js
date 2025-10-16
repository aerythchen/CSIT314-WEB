const DeleteCategoryController = require('../controller/platformmanager_deletecategory');

class DeleteCategoryBoundary {
    constructor() {
        this.controller = new DeleteCategoryController();
    }

    displayDeleteCategoryForm() {
        console.log('=== Delete Category ===');
        console.log('Please enter the category ID to delete:');
    }

    handleDeleteCategory(categoryId) {
        console.log('DeleteCategoryBoundary: Handling delete category...');
        return this.controller.deleteCategory(categoryId);
    }

    displayDeleteCategoryResult(result) {
        if (result.success) {
            console.log('✓ Category deleted successfully!');
            console.log(`Category ID: ${result.data.categoryId} has been deleted`);
        } else {
            console.log('✗ Failed to delete category!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = DeleteCategoryBoundary;
