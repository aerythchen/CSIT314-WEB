const CSRRepresentative = require('../entity/CSRRepresentative');

class SaveToShortlistController {
    constructor() {
        this.entity = new CSRRepresentative();
        // Entity ready to use
    }

    saveToShortlist(data) {
        console.log(`SaveToShortlistController: Saving opportunity ${opportunityId} for user ${userId}...`);
        
        
        const { opportunityId, userId } = data;
        // Validate the save action
        const validationResult = this.validateSaveAction(opportunityId, userId);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }
        
        // Process the save action
        return this.processSaveAction(opportunityId, userId);
    }

    validateSaveAction(opportunityId, userId) {
        console.log("Validating save action...");
        
        if (!opportunityId) {
            return {
                isValid: false,
                error: "Opportunity ID is required"
            };
        }
        
        if (!userId) {
            return {
                isValid: false,
                error: "User ID is required"
            };
        }
        
        return { isValid: true };
    }

    processSaveAction(opportunityId, userId) {
        console.log(`Processing save action for opportunity ${opportunityId}...`);
        
        // Use consolidated entity method directly
        const result = this.entity.saveToShortlist(userId, opportunityId);
        
        if (!result.success) {
            return {
                success: false,
                error: result.error
            };
        }
        
        console.log("Opportunity saved to shortlist successfully");
        
        return {
            success: true,
            message: "Opportunity added to shortlist",
            data: result.data
        };
    }
}

module.exports = SaveToShortlistController;

