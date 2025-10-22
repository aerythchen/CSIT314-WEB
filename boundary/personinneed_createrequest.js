const personinneed_createrequest = require('../controller/personinneed_createrequest');
const Category = require('../entity/Category');

class Personinneed_createrequestBoundary {
    constructor() {
        this.controller = new personinneed_createrequest();
        this.categoryEntity = new Category();
    }

    async handleCreateRequest(data) {
        // 1. VALIDATE UI DATA (UI Logic)
        const validationResult = this.validateRequestData(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }
        
        // 2. GET CATEGORY ID from category name
        const categoryResult = await this.categoryEntity.getCategoryByName(data.category);
        if (!categoryResult.success) {
            return {
                success: false,
                error: `Category "${data.category}" not found. Please contact support.`
            };
        }
        
        // 3. CALL CONTROLLER with complete data
        const result = this.controller.createRequest({
            ...data,
            createdBy: data.userId,
            createdByName: data.userName || 'Unknown User',
            categoryId: categoryResult.data.id,
            categoryName: data.category,
            status: 'pending'
        });
        
        // 4. FORMAT RESPONSE FOR UI (UI Logic)
        if (result.success) {
            return {
                ...result,
                redirectUrl: result.redirectUrl || '/personinneed/dashboard'
            };
        } else {
            return result;
        }
    }
    
    validateRequestData(data) {
        const { title, description, category, urgency } = data;
        
        // Validate title
        if (!title || title.trim() === "") {
            return {
                isValid: false,
                error: "Request title is required"
            };
        }
        
        if (title.trim().length < 5) {
            return {
                isValid: false,
                error: "Title must be at least 5 characters"
            };
        }
        
        if (title.length > 200) {
            return {
                isValid: false,
                error: "Title cannot exceed 200 characters"
            };
        }
        
        // Validate description (optional)
        if (description && description.trim().length > 0 && description.trim().length < 10) {
            return {
                isValid: false,
                error: "Description must be at least 10 characters if provided"
            };
        }
        
        // Validate category
        const validCategories = ["Food", "Shelter", "Medical", "Education", "Employment", "Other"];
        if (!category || !validCategories.includes(category)) {
            return {
                isValid: false,
                error: "Please select a valid category"
            };
        }
        
        // Validate urgency
        const validUrgencies = ["low", "medium", "high", "critical"];
        if (!urgency || !validUrgencies.includes(urgency)) {
            return {
                isValid: false,
                error: "Please select a valid urgency level"
            };
        }
        
        return { isValid: true };
    }
        
}

module.exports = Personinneed_createrequestBoundary;