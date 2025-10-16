const CreateRequestEntity = require('../entity/PersonInNeed');

class CreateRequestController {
    constructor() {
        this.entity = new PersonInNeed();
        this.entity.initialize();
    }

    createRequest(data) {
        console.log("CreateRequestController: Processing request creation...");
        
        const { title, description, category, urgency, contact, createdBy, status } = data;
        
        // Validate request data
        const validationResult = this.validateRequestData(title, description, category, urgency);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                request: null
            };
        }
        
        // Process request creation
        return this.processRequestCreation(title, description, category, urgency, contact, createdBy, status);
    }

    validateRequestData(title, description, category, urgency) {
        console.log("Validating request data...");
        
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
        
        // Validate description
        if (!description || description.trim() === "") {
            return {
                isValid: false,
                error: "Request description is required"
            };
        }
        
        if (description.trim().length < 20) {
            return {
                isValid: false,
                error: "Description must be at least 20 characters"
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
        const validUrgencies = ["Low", "Medium", "High", "Critical"];
        if (!urgency || !validUrgencies.includes(urgency)) {
            return {
                isValid: false,
                error: "Please select a valid urgency level"
            };
        }
        
        return { isValid: true };
    }

    processRequestCreation(title, description, category, urgency, contact, createdBy, status) {
        console.log("Processing request creation...");
        
        // Use Entity to store request data
        const entityResult = this.entity.process({
            userId: createdBy,
            title: title.trim(),
            description: description.trim(),
            category: category,
            urgency: urgency,
            contact: contact,
            status: status || 'pending'
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                request: null
            };
        }
        
        // Get stored data from entity
        const requestData = this.entity.getData();
        
        console.log("Request created successfully");
        
        return {
            success: true,
            request: requestData.data,
            message: "Request created successfully"
        };
    }
}

module.exports = CreateRequestController;

