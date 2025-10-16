const CreateCategoryEntity = require('../entity/PlatformManager');

class CreateCategoryController {
    constructor() {
        this.entity = new PlatformManager();
        this.entity.initialize();
    }

    createCategory(data) {
        console.log("CreateCategoryController: Processing category creation...");
        
        // Validate category data
        const validationResult = this.validateCategoryData(name, description, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                category: null
            };
        }
        
        // Process category creation
        return this.processCategoryCreation(name, description, status);
    }

    validateCategoryData(name, description, status) {
        console.log("Validating category data...");
        
        // Check if name is provided
        if (!name || name.trim() === "") {
            return {
                isValid: false,
                error: "Category name is required"
            };
        }
        
        // Check name length
        if (name.length < 3) {
            return {
                isValid: false,
                error: "Category name must be at least 3 characters"
            };
        }
        
        if (name.length > 50) {
            return {
                isValid: false,
                error: "Category name must not exceed 50 characters"
            };
        }
        
        // Validate name format (alphanumeric and spaces)
        const nameRegex = /^[a-zA-Z0-9\s&-]+$/;
        if (!nameRegex.test(name)) {
            return {
                isValid: false,
                error: "Category name can only contain letters, numbers, spaces, &, and -"
            };
        }
        
        // Validate description if provided
        if (description && description.length > 500) {
            return {
                isValid: false,
                error: "Description must not exceed 500 characters"
            };
        }
        
        // Validate status
        const validStatuses = ["active", "inactive"];
        if (status && !validStatuses.includes(status.toLowerCase())) {
            return {
                isValid: false,
                error: "Status must be either 'active' or 'inactive'"
            };
        }
        
        return { isValid: true };
    }

    processCategoryCreation(name, description, status) {
        console.log(`Processing creation of category: ${name}...`);
        
        // Use Entity to create and store category
        const entityResult = this.entity.process({
            name: name.trim(),
            description: description?.trim() || "",
            status: status || "active"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                category: null
            };
        }
        
        // Get stored category data
        const categoryData = this.entity.getData();
        
        console.log(`Category created successfully with ID: ${categoryData.data.id}`);
        
        return {
            success: true,
            category: categoryData.data,
            message: "Category created successfully"
        };
    }
}

module.exports = CreateCategoryController;

