const UserProfile = require('../entity/UserProfile');

class UpdateUserProfileController {
    constructor() {
        this.entity = new UserProfile();
    }

    async updateUserProfile(data) {
        console.log("UpdateUserProfileController: Processing profile update...");
        
        try {
            // Prepare update data for profile
            const profileUpdateData = {
                firstname: data.firstName,
                lastname: data.lastName,
                email: data.email,
                usertype: data.userType,
                status: data.status,
                adminnotes: data.adminNotes,
                updatedat: new Date().toISOString()
            };
            
            // Update profile
            const profileResult = await this.entity.updateProfile(data.editUserId, profileUpdateData);
            
            if (!profileResult.success) {
                return { success: false, error: `Failed to update profile: ${profileResult.error}` };
            }
            
            // Update account if username or other account fields are provided
            if (data.username || data.password || data.forcePasswordReset !== undefined || data.accountLocked !== undefined) {
                const UserAccount = require('../entity/UserAccount');
                const accountEntity = new UserAccount();
                
                const accountUpdateData = {
                    username: data.username,
                    forcepasswordreset: data.forcePasswordReset || false,
                    accountlocked: data.accountLocked || false,
                    updatedat: new Date().toISOString()
                };
                
                // Only include password if provided
                if (data.password && data.password.trim() !== '') {
                    accountUpdateData.passwordhash = data.password; // In production, this should be hashed
                }
                
                const accountResult = await accountEntity.updateAccount(data.editUserId, accountUpdateData);
                
                if (!accountResult.success) {
                    return { success: false, error: `Profile updated but failed to update account: ${accountResult.error}` };
                }
            }
            
            return { 
                success: true, 
                message: "User profile updated successfully",
                data: profileResult.data
            };
            
        } catch (error) {
            console.error('Error in updateUserProfile:', error);
            return { success: false, error: 'Internal server error during update' };
        }
    }

}

module.exports = UpdateUserProfileController;

