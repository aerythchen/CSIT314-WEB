const { db } = require('../database');

class CreateCategoryEntity {
    constructor() {
        this.category = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("CreateCategoryEntity: Initializing...");
        this.category = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("CreateCategoryEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.name || typeof data.name !== 'string') {
            return { isValid: false, error: "Valid category name is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("CreateCategoryEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check for duplicate category name
        const existing = db.findOne('categories', { 
            name: data.name, 
            isDeleted: false 
        });
        
        if (existing) {
            return {
                success: false,
                error: "Category name already exists"
            };
        }

        // Insert new category
        const result = db.insert('categories', {
            name: data.name,
            description: data.description || "",
            status: data.status || "active",
            requestCount: 0,
            createdBy: data.createdBy || "platformmanager"
        });

        if (!result.success) {
            return result;
        }

        this.category = result.data;

        // Create audit log
        db.insert('auditLogs', {
            action: 'CREATE_CATEGORY',
            entityType: 'category',
            entityId: this.category.id,
            performedBy: data.createdBy || 'platformmanager',
            performedByType: 'platformmanager',
            details: {
                name: this.category.name,
                status: this.category.status
            }
        });

        console.log("Category created successfully");
        return {
            success: true,
            message: "Category created",
            data: {
                id: this.category.id,
                name: this.category.name
            }
        };
    }

    getData() {
        console.log("CreateCategoryEntity: Retrieving data...");
        
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

module.exports = CreateCategoryEntity;
