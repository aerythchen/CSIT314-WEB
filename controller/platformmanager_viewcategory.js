const Category = require('../entity/Category');

class ViewCategoryController {
    constructor() {
        this.entity = new Category();
    }

    async viewCategory(data) {
        console.log("ViewCategoryController: Processing view category request...");
        
        // Call entity's viewCategory method
        return await this.entity.viewCategory(data);
    }
    
    //additional method over engineering here
    async getCategoryRequestCount(data) {
        console.log("ViewCategoryController: Processing get category request count...");
        
        // Call entity's getCategoryRequestCount method
        return await this.entity.getCategoryRequestCount(data.categoryId);
    }
}

module.exports = ViewCategoryController;

