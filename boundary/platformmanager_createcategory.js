const CreateCategoryController = require('../controller/platformmanager_createcategory');

class CreateCategoryBoundary {
    constructor() {
        this.controller = new CreateCategoryController();
    }

    displayCreateCategoryForm() {
        console.log('=== Create Category ===');
        console.log('Please enter the category details:');
    }

    handleCreateCategory(categoryData) {
        console.log('CreateCategoryBoundary: Handling create category...');
        return this.controller.createCategory(categoryData);
    }

    displayCreateCategoryResult(result) {
        if (result.success) {
            console.log('✓ Category created successfully!');
            console.log(`Category ID: ${result.data.category.id}`);
            console.log(`Name: ${result.data.category.name}`);
        } else {
            console.log('✗ Failed to create category!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = CreateCategoryBoundary;
