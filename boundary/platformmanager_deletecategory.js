const platformmanager_deletecategory = require('../controller/platformmanager_deletecategory');

class Platformmanager_deletecategoryBoundary {
    constructor() {
        this.controller = new platformmanager_deletecategory();
    }

    async handleDeleteCategory(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.deleteCategory(formattedData);
        } catch (error) {
            console.error('Error in handleDeleteCategory:', error);
            return {
                success: false,
                error: "Failed to delete category: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_deletecategoryBoundary;