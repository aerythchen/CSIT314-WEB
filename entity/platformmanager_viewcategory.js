const { db } = require('../database');

class ViewCategoryEntity {
    constructor() {
        this.categories = [];
        this.selectedCategory = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewCategoryEntity: Initializing...");
        this.categories = [];
        this.selectedCategory = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewCategoryEntity: Validating data...");
        
        if (!data) {
            return { isValid: false, error: "Data is required" };
        }

        const validActions = ["getAll", "getById"];
        if (!data.action || !validActions.includes(data.action)) {
            return { isValid: false, error: "Valid action is required (getAll or getById)" };
        }

        if (data.action === "getById") {
            if (!data.categoryId || typeof data.categoryId !== 'string') {
                return { isValid: false, error: "Valid category ID is required for getById action" };
            }
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewCategoryEntity: Processing data...");
        
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        if (data.action === "getAll") {
            // Get all active categories from database
            this.categories = db.find('categories', { isDeleted: false });
            this.selectedCategory = null;
            
            console.log(`Fetched ${this.categories.length} categories`);
            return {
                success: true,
                message: "Categories retrieved",
                count: this.categories.length
            };
        }
        
        if (data.action === "getById") {
            // Get specific category from database
            this.selectedCategory = db.findById('categories', data.categoryId);
            this.categories = [];
            
            if (!this.selectedCategory || this.selectedCategory.isDeleted) {
                this.selectedCategory = null;
                return {
                    success: false,
                    error: `Category with ID ${data.categoryId} not found`
                };
            }
            
            console.log(`Category found: ${this.selectedCategory.name}`);
            return {
                success: true,
                message: "Category retrieved"
            };
        }

        return {
            success: false,
            error: "Unknown action"
        };
    }

    getData() {
        console.log("ViewCategoryEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        if (this.selectedCategory === null && this.categories !== null) {
            return {
                success: true,
                data: {
                    categories: this.categories,
                    count: this.categories.length
                }
            };
        }

        return {
            success: true,
            data: {
                category: this.selectedCategory,
                categories: []
            }
        };
    }
}

module.exports = ViewCategoryEntity;
