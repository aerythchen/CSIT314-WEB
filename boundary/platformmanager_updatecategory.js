const platformmanager_updatecategory = require('../controller/platformmanager_updatecategory');

class Platformmanager_updatecategoryBoundary {
    constructor() {
        this.controller = new platformmanager_updatecategory();
    }

    async handleUpdateCategory(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.updateCategory(formattedData);
        } catch (error) {
            console.error('Error in handleUpdateCategory:', error);
            return {
                success: false,
                error: "Failed to update category: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_updatecategoryBoundary;