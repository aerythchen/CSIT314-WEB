const { db } = require('../database');

class DeleteCategoryEntity {
    constructor() {
        this.category = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("DeleteCategoryEntity: Initializing...");
        this.category = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("DeleteCategoryEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.categoryId || typeof data.categoryId !== 'string') {
            return { isValid: false, error: "Valid category ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("DeleteCategoryEntity: Processing data...");
        
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

        // Check if category has active requests
        const activeRequests = db.find('requests', { 
            categoryId: data.categoryId, 
            isDeleted: false,
            status: (status) => ['pending', 'approved'].includes(status)
        });

        if (activeRequests.length > 0) {
            return {
                success: false,
                error: `Cannot delete category with ${activeRequests.length} active requests`
            };
        }

        const now = new Date().toISOString();

        // Soft delete category
        const result = db.update('categories', data.categoryId, {
            isDeleted: true,
            deletedAt: now,
            deletedBy: data.deletedBy || "platformmanager",
            status: "inactive"
        });

        if (!result.success) {
            return result;
        }

        this.category = result.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'DELETE_CATEGORY',
            entityType: 'category',
            entityId: this.category.id,
            performedBy: data.deletedBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: {
                name: existing.name,
                requestCount: existing.requestCount
            }
        });

        console.log("Category deleted successfully");
        return {
            success: true,
            message: "Category deleted",
            data: {
                id: this.category.id,
                name: this.category.name,
                deletedAt: this.category.deletedAt
            }
        };
    }

    getData() {
        console.log("DeleteCategoryEntity: Retrieving data...");
        
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

module.exports = DeleteCategoryEntity;
