const ViewCategoryEntity = require('../entity/PlatformManager');

class ViewCategoryController {
    constructor() {
        this.entity = new PlatformManager();
        this.entity.initialize();
    }

    viewCategory(data) {
        console.log("ViewCategoryController: Processing view category request...");
        
        // Validate category ID
        if (!categoryId || categoryId.trim() === "") {
            return {
                success: false,
                error: "Category ID is required",
                category: null
            };
        }
        
        // Process view request for specific category
        return this.processViewRequest(categoryId);
    }

    getAllCategories() {
        console.log("ViewCategoryController: Processing get all categories request...");
        
        // Process request to get all categories
        const entityResult = this.entity.process({
            action: "getAll"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                categories: []
            };
        }
        
        // Get all categories data
        const categoriesData = this.entity.getData();
        
        console.log(`Retrieved ${categoriesData.data.categories.length} categories`);
        
        return {
            success: true,
            categories: categoriesData.data.categories,
            count: categoriesData.data.count
        };
    }

    processViewRequest(categoryId) {
        console.log(`Processing view request for category: ${categoryId}...`);
        
        // Use Entity to fetch category data
        const entityResult = this.entity.process({
            action: "getById",
            categoryId: categoryId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                category: null
            };
        }
        
        // Get category data
        const categoryData = this.entity.getData();
        
        if (!categoryData.data.category) {
            return {
                success: false,
                error: "Category not found",
                category: null
            };
        }
        
        console.log(`Category retrieved: ${categoryData.data.category.name}`);
        
        return {
            success: true,
            category: categoryData.data.category
        };
    }
}

module.exports = ViewCategoryController;

