const useradmin_createuseraccount = require('../controller/useradmin_createuseraccount');

class Useradmin_createuseraccountBoundary {
    constructor() {
        this.controller = new useradmin_createuseraccount();
    }

    handleCreateUserAccount(data) {
        // Format data and call controller - entity already returns proper response format
        const formattedData = {
            username: data.username,
            email: data.email,
            password: data.password,
            createdBy: data.userId,
            userType: 'useradmin'
        };
        
        return this.controller.createUserAccount(formattedData);
    }
}

module.exports = Useradmin_createuseraccountBoundary;