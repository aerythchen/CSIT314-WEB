const platformmanager_viewcategory = require('../controller/platformmanager_viewcategory');

class Platformmanager_viewcategoryBoundary {
    constructor() {
        this.controller = new platformmanager_viewcategory();
    }

    async handleViewCategory(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                ...data,
                userType: 'platformmanager'
            };
            
            return await this.controller.viewCategory(formattedData);
        } catch (error) {
            console.error('Error in handleViewCategory:', error);
            return {
                success: false,
                error: "Failed to view categories: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_viewcategoryBoundary;