class SaveToShortlistEntity {
    constructor() {
        this.shortlistItem = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("SaveToShortlistEntity: Initializing...");
        this.shortlistItem = {
            id: null,
            userId: null,
            opportunityId: null,
            opportunityTitle: "",
            category: "",
            dateSaved: "",
            status: "active",
            notes: ""
        };
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("SaveToShortlistEntity: Validating data...");
        
        if (!data) {
            return {
                isValid: false,
                error: "Data is required"
            };
        }

        // Validate user ID
        if (!data.userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }

        // Validate opportunity ID
        if (!data.opportunityId) {
            return {
                isValid: false,
                error: "Opportunity ID is required"
            };
        }

        // Validate ID types
        if (typeof data.userId !== 'string' && typeof data.userId !== 'number') {
            return {
                isValid: false,
                error: "User ID must be a string or number"
            };
        }

        if (typeof data.opportunityId !== 'string' && typeof data.opportunityId !== 'number') {
            return {
                isValid: false,
                error: "Opportunity ID must be a string or number"
            };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("SaveToShortlistEntity: Processing data...");
        
        // Validate before processing
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Create shortlist item
        this.shortlistItem = {
            id: data.id || `shortlist_${Date.now()}`,
            userId: data.userId,
            opportunityId: data.opportunityId,
            opportunityTitle: data.opportunityTitle || "",
            category: data.category || "",
            dateSaved: new Date().toISOString(),
            status: "active",
            notes: data.notes || ""
        };

        console.log("Shortlist item processed successfully");
        return {
            success: true,
            message: "Shortlist item created",
            data: this.shortlistItem
        };
    }

    getData() {
        console.log("SaveToShortlistEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        return {
            success: true,
            data: this.shortlistItem
        };
    }
}

module.exports = SaveToShortlistEntity;

