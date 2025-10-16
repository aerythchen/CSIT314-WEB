class ViewOpportunityEntity {
    constructor() {
        this.opportunity = null;
        this.viewHistory = [];
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewOpportunityEntity: Initializing...");
        this.opportunity = {
            id: null,
            title: "",
            category: "",
            description: "",
            location: "",
            organization: "",
            datePosted: "",
            status: "active",
            requirements: "",
            viewCount: 0
        };
        this.viewHistory = [];
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewOpportunityEntity: Validating data...");
        
        if (!data) {
            return {
                isValid: false,
                error: "Data is required"
            };
        }

        // Validate ID
        if (data.id && (typeof data.id !== 'string' && typeof data.id !== 'number')) {
            return {
                isValid: false,
                error: "Opportunity ID must be a string or number"
            };
        }

        // Validate title
        if (data.title && typeof data.title !== 'string') {
            return {
                isValid: false,
                error: "Title must be a string"
            };
        }

        // Validate category
        if (data.category && typeof data.category !== 'string') {
            return {
                isValid: false,
                error: "Category must be a string"
            };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewOpportunityEntity: Processing data...");
        
        // Validate before processing
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Store opportunity data
        this.opportunity = {
            id: data.id || null,
            title: data.title || "",
            category: data.category || "",
            description: data.description || "",
            location: data.location || "",
            organization: data.organization || "",
            datePosted: data.datePosted || new Date().toISOString(),
            status: data.status || "active",
            requirements: data.requirements || "",
            viewCount: data.viewCount || 0
        };

        // Log view activity
        this.viewHistory.push({
            timestamp: new Date().toISOString(),
            opportunityId: data.id,
            userId: data.userId || null
        });

        console.log("Opportunity data processed successfully");
        return {
            success: true,
            message: "Opportunity data processed",
            data: this.opportunity
        };
    }

    getData() {
        console.log("ViewOpportunityEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: {
                opportunity: this.opportunity,
                viewHistory: this.viewHistory,
                totalViews: this.viewHistory.length
            }
        };
    }
}

module.exports = ViewOpportunityEntity;

