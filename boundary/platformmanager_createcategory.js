const platformmanager_createcategory = require('../controller/platformmanager_createcategory');

class Platformmanager_createcategoryBoundary {
    constructor() {
        this.controller = new platformmanager_createcategory();
    }

    async handleCreateCategory(data) {
        try {
            // Format data and call controller - entity already returns proper response format
            const formattedData = {
                categoryName: data.categoryName,
                description: data.description,
                createdBy: data.userId,
                userType: 'platformmanager'
            };
            
            return await this.controller.createCategory(formattedData);
        } catch (error) {
            console.error('Error in handleCreateCategory:', error);
            return {
                success: false,
                error: "Failed to create category: " + error.message
            };
        }
    }
}

module.exports = Platformmanager_createcategoryBoundary;