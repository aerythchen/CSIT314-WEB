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
}

module.exports = ViewCategoryController;

