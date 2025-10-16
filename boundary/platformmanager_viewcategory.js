const ViewCategoryController = require('../controller/platformmanager_viewcategory');

class ViewCategoryBoundary {
    constructor() {
        this.controller = new ViewCategoryController();
    }

    displayViewCategoryForm() {
        console.log('=== View Category ===');
        console.log('Please enter the category ID to view:');
    }

    handleViewCategory(categoryId) {
        console.log('ViewCategoryBoundary: Handling view category...');
        return this.controller.viewCategory(categoryId);
    }

    displayViewCategoryResult(result) {
        if (result.success) {
            console.log('✓ Category retrieved successfully!');
            console.log(`Category ID: ${result.data.category.id}`);
            console.log(`Name: ${result.data.category.name}`);
            console.log(`Description: ${result.data.category.description}`);
        } else {
            console.log('✗ Failed to retrieve category!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = ViewCategoryBoundary;
