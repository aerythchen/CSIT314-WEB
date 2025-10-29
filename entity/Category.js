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
    
    async createCategory(categoryData) {
        const category = {
            id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: categoryData.categoryName,
            description: categoryData.description || '',
            status: 'active',
            requestcount: 0,
            createdat: new Date().toISOString(),
            updatedat: new Date().toISOString(),
            isdeleted: false
        };

        const result = await db.insert('categories', category);
        return result;
    }

    // ========================================
    // CATEGORY MANAGEMENT
    // ========================================
    
    async updateCategory(categoryId, updateData) {
        const category = await db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        // Only update allowed fields to avoid database column errors
        const allowedFields = ['name', 'description', 'status', 'requestcount'];
        const filteredUpdateData = {};
        
        for (const field of allowedFields) {
            if (updateData.hasOwnProperty(field)) {
                filteredUpdateData[field] = updateData[field];
            }
        }

        const updatedCategory = {
            ...filteredUpdateData,
            updatedat: new Date().toISOString()
        };

        const result = await db.update('categories', categoryId, updatedCategory);
        return result;
    }

    async getCategory(categoryId) {
        const category = await db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        return { success: true, data: category };
    }

    async deleteCategory(categoryId) {
        const category = await db.findOne('categories', { id: categoryId, isDeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const result = await db.update('categories', categoryId, {
            isdeleted: true,
            updatedat: new Date().toISOString()
        });

        return result;
    }

    // ========================================
    // CATEGORY SEARCH
    // ========================================
    
    async searchCategories(searchTerm) {
        let categories = await db.find('categories', { isdeleted: false });

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

    async getAllCategories() {
        const categories = await db.find('categories', { isdeleted: false });

        return {
            success: true,
            data: categories,
            count: categories.length
        };
    }

    // Alias for viewCategory to match controller expectations
    async viewCategory(data) {
        return await this.getAllCategories();
    }

    async getActiveCategories() {
        const categories = await db.find('categories', { 
            status: 'active', 
            isdeleted: false 
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
    
    async activateCategory(categoryId) {
        return await this.updateCategory(categoryId, { status: 'active' });
    }

    async deactivateCategory(categoryId) {
        return await this.updateCategory(categoryId, { status: 'inactive' });
    }

    // ========================================
    // CATEGORY REQUEST COUNTING
    // ========================================
    
    async incrementRequestCount(categoryId) {
        const category = await db.findOne('categories', { id: categoryId, isdeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const newRequestCount = (category.requestcount || 0) + 1;
        return await this.updateCategory(categoryId, { requestcount: newRequestCount });
    }

    async decrementRequestCount(categoryId) {
        const category = await db.findOne('categories', { id: categoryId, isdeleted: false });
        
        if (!category) {
            return { success: false, error: "Category not found" };
        }

        const newRequestCount = Math.max((category.requestcount || 0) - 1, 0);
        return await this.updateCategory(categoryId, { requestcount: newRequestCount });
    }

    // ========================================
    // CATEGORY VALIDATION
    // ========================================
    
    async validateCategoryName(name, excludeId = null) {
        const existingCategory = await db.findOne('categories', { 
            name: name, 
            isdeleted: false 
        });

        if (existingCategory && existingCategory.id !== excludeId) {
            return { isValid: false, error: "Category name already exists" };
        }

        return { isValid: true };
    }

    async getCategoryByName(name) {
        const category = await db.findOne('categories', { 
            name: name, 
            isdeleted: false 
        });

        if (!category) {
            return { success: false, error: "Category not found" };
        }

        return { success: true, data: category };
    }

    async getCategoryRequestCount(categoryId) {
        try {
            const count = await db.count('requests', { 
                categoryid: categoryId, 
                isdeleted: false 
            });
            return { success: true, count: count };
        } catch (error) {
            console.error('Error counting requests for category:', error);
            return { success: false, error: error.message, count: 0 };
        }
    }
}

module.exports = Category;
