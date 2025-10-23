const { db } = require('../database');

/**
 * Category Entity - Handles category business logic
 * Contains methods for category operations and management
 */
class Category {
    constructor() {
        this.db = db;
    }

    // ========================================
    // CATEGORY CREATION
    // ========================================
    
    createCategory(categoryData) {
        const category = {
            id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: categoryData.name,
            description: categoryData.description || '',
            status: 'active',
            requestCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isDeleted: false
        };

        const result = db.insert('categories', category);
        return result;
    }

    // ========================================
    // CATEGORY MANAGEMENT
    // ========================================
    
    updateCategory(categoryId, updateData) {
        const category = db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const updatedCategory = {
            ...category,
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        const result = db.update('categories', categoryId, updatedCategory);
        return result;
    }

    getCategory(categoryId) {
        const category = db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        return { success: true, data: category };
    }

    deleteCategory(categoryId) {
        const category = db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const result = db.update('categories', categoryId, {
            isDeleted: true,
            updatedAt: new Date().toISOString()
        });

        return result;
    }

    // ========================================
    // CATEGORY SEARCH
    // ========================================
    
    searchCategories(searchTerm, status) {
        let categories = db.findAll('categories', { isDeleted: false });

        // Filter by status
        if (status && status !== 'all') {
            categories = categories.filter(c => c.status === status);
        }

        // Filter by search term
        if (searchTerm) {
            categories = categories.filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return {
            success: true,
            data: categories,
            count: categories.length
        };
    }

    getAllCategories() {
        const categories = db.findAll('categories', { isDeleted: false });

        return {
            success: true,
            data: categories,
            count: categories.length
        };
    }

    getActiveCategories() {
        const categories = db.findAll('categories', { 
            status: 'active', 
            isDeleted: false 
        });

        return {
            success: true,
            data: categories,
            count: categories.length
        };
    }

    // ========================================
    // CATEGORY STATUS MANAGEMENT
    // ========================================
    
    activateCategory(categoryId) {
        return this.updateCategory(categoryId, { status: 'active' });
    }

    deactivateCategory(categoryId) {
        return this.updateCategory(categoryId, { status: 'inactive' });
    }

    // ========================================
    // CATEGORY REQUEST COUNTING
    // ========================================
    
    incrementRequestCount(categoryId) {
        const category = db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const newRequestCount = (category.requestCount || 0) + 1;
        return this.updateCategory(categoryId, { requestCount: newRequestCount });
    }

    decrementRequestCount(categoryId) {
        const category = db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const newRequestCount = Math.max((category.requestCount || 0) - 1, 0);
        return this.updateCategory(categoryId, { requestCount: newRequestCount });
    }

    // ========================================
    // CATEGORY VALIDATION
    // ========================================
    
    validateCategoryName(name, excludeId = null) {
        const existingCategory = db.findOne('categories', { 
            name: name, 
            isDeleted: false 
        });

        if (existingCategory && existingCategory.id !== excludeId) {
            return { isValid: false, error: "Category name already exists" };
        }

        return { isValid: true };
    }

    async getCategoryByName(name) {
        const category = await db.findOne('categories', { 
            name: name, 
            isDeleted: false 
        });

        if (!category) {
            return { success: false, error: "Category not found" };
        }

        return { success: true, data: category };
    }
}

module.exports = Category;
