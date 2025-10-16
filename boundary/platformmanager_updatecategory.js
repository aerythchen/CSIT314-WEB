const UpdateCategoryController = require('../controller/platformmanager_updatecategory');

class UpdateCategoryBoundary {
    constructor() {
        this.controller = new UpdateCategoryController();
    }

    displayUpdateCategoryForm() {
        console.log('=== Update Category ===');
        console.log('Please enter the category ID and updated details:');
    }

    handleUpdateCategory(categoryId, updateData) {
        console.log('UpdateCategoryBoundary: Handling update category...');
        return this.controller.updateCategory(categoryId, updateData);
    }

    displayUpdateCategoryResult(result) {
        if (result.success) {
            console.log('✓ Category updated successfully!');
            console.log(`Category ID: ${result.data.category.id}`);
            console.log(`Updated Name: ${result.data.category.name}`);
        } else {
            console.log('✗ Failed to update category!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = UpdateCategoryBoundary;
