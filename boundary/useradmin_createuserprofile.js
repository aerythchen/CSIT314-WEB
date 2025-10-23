const useradmin_createuserprofile = require('../controller/useradmin_createuserprofile');
const useradmin_createuseraccount = require('../controller/useradmin_createuseraccount');

class Useradmin_createuserprofileBoundary {
    constructor() {
        this.profileController = new useradmin_createuserprofile();
        this.accountController = new useradmin_createuseraccount();
    }

    async handleCreateUserProfile(data) {
        try {
            // First, create the user profile
            const profileData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                userType: data.userType,
                createdBy: data.userId
            };
            
            const profileResult = await this.profileController.createUserProfile(profileData);
            
            if (!profileResult.success) {
                return profileResult;
            }
            
            // Then, create the user account
            const accountData = {
                profileId: profileResult.data.id,
                username: data.username,
                passwordHash: data.password, // In production, this should be hashed
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                userType: data.userType,
                createdBy: data.userId
            };
            
            const accountResult = await this.accountController.createUserAccount(accountData);
            
            if (!accountResult.success) {
                // If account creation fails, we should clean up the profile
                // For now, we'll just return the error
                return accountResult;
            }
            
            // Return success with both profile and account data
            return {
                success: true,
                message: "User profile and account created successfully",
                data: {
                    profile: profileResult.data,
                    account: accountResult.data
                }
            };
            
        } catch (error) {
            console.error('Error in handleCreateUserProfile:', error);
            return {
                success: false,
                error: "Failed to create user: " + error.message
            };
        }
    }
}

module.exports = Useradmin_createuserprofileBoundary;