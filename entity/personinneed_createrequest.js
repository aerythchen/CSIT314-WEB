const { db } = require('../database');
const { RequestHelpers } = require('../database/helpers');

class CreateRequestEntity {
    constructor() {
        this.request = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("CreateRequestEntity: Initializing...");
        this.request = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("CreateRequestEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        if (!data.title || typeof data.title !== 'string') {
            return { isValid: false, error: "Valid title is required" };
        }

        if (!data.description || typeof data.description !== 'string') {
            return { isValid: false, error: "Valid description is required" };
        }

        if (!data.categoryId || typeof data.categoryId !== 'string') {
            return { isValid: false, error: "Valid category ID is required" };
        }

        if (!data.location || typeof data.location !== 'string') {
            return { isValid: false, error: "Valid location is required" };
        }

        if (!data.urgency || typeof data.urgency !== 'string') {
            return { isValid: false, error: "Valid urgency is required" };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("CreateRequestEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Check if category exists
        const category = db.findById('categories', data.categoryId);
        if (!category || category.isDeleted) {
            return {
                success: false,
                error: "Category not found"
            };
        }

        // Get user profile for createdByName
        let createdByName = "Unknown";
        if (data.createdBy) {
            const profile = db.findById('userProfiles', data.createdBy);
            if (profile) {
                createdByName = `${profile.firstName} ${profile.lastName}`;
            }
        }

        // Create request using helper
        const result = RequestHelpers.createRequest({
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            categoryName: category.name,
            location: data.location,
            urgency: data.urgency,
            status: data.status || "pending",
            createdBy: data.createdBy,
            createdByName: createdByName
        });

        if (!result.success) {
            return result;
        }

        this.request = result.data;

        console.log("Request created successfully");
        return {
            success: true,
            message: "Request created",
            data: {
                id: this.request.id,
                title: this.request.title
            }
        };
    }

    getData() {
        console.log("CreateRequestEntity: Retrieving data...");
        
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

module.exports = CreateRequestEntity;
