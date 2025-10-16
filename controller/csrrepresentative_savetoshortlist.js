const SaveToShortlistEntity = require('../entity/csrrepresentative_savetoshortlist');

class SaveToShortlistController {
    constructor() {
        this.entity = new SaveToShortlistEntity();
        this.entity.initialize();
    }

    saveToShortlist(opportunityId, userId) {
        console.log(`SaveToShortlistController: Saving opportunity ${opportunityId} for user ${userId}...`);
        
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
        
        // Use Entity to store shortlist item
        const entityResult = this.entity.process({
            userId: userId,
            opportunityId: opportunityId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error
            };
        }
        
        // Get stored data
        const shortlistData = this.entity.getData();
        
        console.log("Opportunity saved to shortlist successfully");
        
        return {
            success: true,
            message: "Opportunity added to shortlist",
            data: shortlistData.data
        };
    }
}

module.exports = SaveToShortlistController;

