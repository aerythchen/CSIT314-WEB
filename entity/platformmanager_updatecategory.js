const { db } = require('../database');

class UpdateCategoryEntity {
    constructor() {
        this.category = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("UpdateCategoryEntity: Initializing...");
        this.category = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("UpdateCategoryEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.categoryId || typeof data.categoryId !== 'string') {
            return { isValid: false, error: "Valid category ID is required" };
        }

        if (!data.name && !data.description && !data.status) {
            return { isValid: false, error: "At least one field must be provided for update" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("UpdateCategoryEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if category exists
        const existing = db.findById('categories', data.categoryId);
        if (!existing || existing.isDeleted) {
            return {
                success: false,
                error: "Category not found"
            };
        }

        // Check for duplicate name if name is being changed
        if (data.name && data.name !== existing.name) {
            const duplicate = db.findOne('categories', { 
                name: data.name, 
                isDeleted: false 
            });
            
            if (duplicate && duplicate.id !== data.categoryId) {
                return {
                    success: false,
                    error: "Category name already exists"
                };
            }
        }

        // Prepare update object
        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.status) updateData.status = data.status;
        updateData.updatedBy = data.updatedBy || "platformmanager";

        // Update category in database
        const result = db.update('categories', data.categoryId, updateData);

        if (!result.success) {
            return result;
        }

        this.category = result.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'UPDATE_CATEGORY',
            entityType: 'category',
            entityId: this.category.id,
            performedBy: data.updatedBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: updateData
        });

        console.log("Category updated successfully");
        return {
            success: true,
            message: "Category updated",
            data: {
                id: this.category.id,
                name: this.category.name,
                updatedAt: this.category.updatedAt
            }
        };
    }

    getData() {
        console.log("UpdateCategoryEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.category
        };
    }
}

module.exports = UpdateCategoryEntity;
