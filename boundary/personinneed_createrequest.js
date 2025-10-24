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
        
        // 4. RETURN JSON RESPONSE
        return result;
    }
    
    validateRequestData(data) {
        const { title, description, category, urgency } = data;
        
        // Essential database requirements only
        if (!title || title.trim() === "") {
            return { isValid: false, error: "Title is required" };
        }
        
        if (!description || description.trim() === "") {
            return { isValid: false, error: "Description is required" };
        }
        
        if (!category) {
            return { isValid: false, error: "Category is required" };
        }
        
        if (!urgency) {
            return { isValid: false, error: "Urgency level is required" };
        }
        
        return { isValid: true };
    }
        
}

module.exports = Personinneed_createrequestBoundary;