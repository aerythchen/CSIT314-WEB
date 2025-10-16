const { db } = require('../database');

class DeleteRequestEntity {
    constructor() {
        this.request = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("DeleteRequestEntity: Initializing...");
        this.request = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("DeleteRequestEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.requestId || typeof data.requestId !== 'string') {
            return { isValid: false, error: "Valid request ID is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("DeleteRequestEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if request exists
        const existing = db.findById('requests', data.requestId);
        if (!existing || existing.isDeleted) {
            return {
                success: false,
                error: "Request not found"
            };
        }

        // Check if user owns this request
        if (data.userId && existing.createdBy !== data.userId) {
            return {
                success: false,
                error: "You can only delete your own requests"
            };
        }

        // Only allow deletion if request is pending
        if (existing.status !== 'pending') {
            return {
                success: false,
                error: `Cannot delete request with status '${existing.status}'`
            };
        }

        const now = new Date().toISOString();

        // Soft delete request
        const result = db.update('requests', data.requestId, {
            isDeleted: true,
            deletedAt: now,
            deletedBy: data.userId || existing.createdBy
        });

        if (!result.success) {
            return result;
        }

        this.request = result.data;

        // Decrement category count
        if (existing.categoryId) {
            const category = db.findById('categories', existing.categoryId);
            if (category && category.requestCount > 0) {
                db.update('categories', existing.categoryId, {
                    requestCount: category.requestCount - 1
                });
            }
        }

        console.log("Request deleted successfully");
        return {
            success: true,
            message: "Request deleted",
            data: {
                id: this.request.id,
                title: this.request.title,
                deletedAt: this.request.deletedAt
            }
        };
    }

    getData() {
        console.log("DeleteRequestEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.request
        };
    }
}

module.exports = DeleteRequestEntity;
