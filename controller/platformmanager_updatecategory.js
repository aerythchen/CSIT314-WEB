const UpdateCategoryEntity = require('../entity/platformmanager_updatecategory');

class UpdateCategoryController {
    constructor() {
        this.entity = new UpdateCategoryEntity();
        this.entity.initialize();
    }

    updateCategory(categoryId, name, description, status) {
        console.log("UpdateCategoryController: Processing category update...");
        
        // Validate update data
        const validationResult = this.validateCategoryUpdate(categoryId, name, description, status);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                category: null
            };
        }
        
        // Process category update
        return this.processCategoryUpdate(categoryId, name, description, status);
    }

    validateCategoryUpdate(categoryId, name, description, status) {
        console.log("Validating category update data...");
        
        // Check if category ID is provided
        if (!categoryId || categoryId.trim() === "") {
            return {
                isValid: false,
                error: "Category ID is required"
            };
        }
        
        // At least one field must be provided for update
        if (!name && !description && !status) {
            return {
                isValid: false,
                error: "At least one field must be provided for update"
            };
        }
        
        // Validate name if provided
        if (name !== undefined && name !== null) {
            if (name.trim() === "") {
                return {
                    isValid: false,
                    error: "Category name cannot be empty"
                };
            }
            
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
            
            // Validate name format
            const nameRegex = /^[a-zA-Z0-9\s&-]+$/;
            if (!nameRegex.test(name)) {
                return {
                    isValid: false,
                    error: "Category name can only contain letters, numbers, spaces, &, and -"
                };
            }
        }
        
        // Validate description if provided
        if (description !== undefined && description !== null) {
            if (description.length > 500) {
                return {
                    isValid: false,
                    error: "Description must not exceed 500 characters"
                };
            }
        }
        
        // Validate status if provided
        if (status !== undefined && status !== null) {
            const validStatuses = ["active", "inactive"];
            if (!validStatuses.includes(status.toLowerCase())) {
                return {
                    isValid: false,
                    error: "Status must be either 'active' or 'inactive'"
                };
            }
        }
        
        return { isValid: true };
    }

    processCategoryUpdate(categoryId, name, description, status) {
        console.log(`Processing update for category: ${categoryId}...`);
        
        // Prepare update data (only include fields that are provided)
        const updateData = {
            categoryId: categoryId.trim()
        };
        
        if (name !== undefined && name !== null) {
            updateData.name = name.trim();
        }
        
        if (description !== undefined && description !== null) {
            updateData.description = description.trim();
        }
        
        if (status !== undefined && status !== null) {
            updateData.status = status.toLowerCase();
        }
        
        // Use Entity to update category
        const entityResult = this.entity.process(updateData);
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                category: null
            };
        }
        
        // Get updated category data
        const categoryData = this.entity.getData();
        
        console.log(`Category updated successfully: ${categoryData.data.name}`);
        
        return {
            success: true,
            category: categoryData.data,
            message: "Category updated successfully"
        };
    }
}

module.exports = UpdateCategoryController;

