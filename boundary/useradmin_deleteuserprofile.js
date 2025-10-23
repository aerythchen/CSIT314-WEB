const useradmin_deleteuserprofile = require('../controller/useradmin_deleteuserprofile');
const useradmin_deleteuseraccount = require('../controller/useradmin_deleteuseraccount');

class Useradmin_deleteuserprofileBoundary {
    constructor() {
        this.profileController = new useradmin_deleteuserprofile();
        this.accountController = new useradmin_deleteuseraccount();
    }

    async handleDeleteUserProfile(data) {
        try {
            // First, find the associated account
            const UserAccount = require('../entity/UserAccount');
            const accountEntity = new UserAccount();
            const accountResult = await accountEntity.getAccountByProfileId(data.profileId);
            
            if (accountResult.success) {
                // Delete the associated account first
                const accountDeleteResult = await this.accountController.deleteUserAccount({
                    accountId: accountResult.data.id
                });
                
                if (!accountDeleteResult.success) {
                    return { success: false, error: `Failed to delete account: ${accountDeleteResult.error}` };
                }
            }
            
            // Then delete the profile
            const profileDeleteResult = await this.profileController.deleteUserProfile(data);
            
            if (!profileDeleteResult.success) {
                return { success: false, error: `Failed to delete profile: ${profileDeleteResult.error}` };
            }
            
            return { 
                success: true, 
                message: "User profile and account deleted successfully",
                data: {
                    profile: profileDeleteResult.data,
                    account: accountResult.success ? accountResult.data : null
                }
            };
            
        } catch (error) {
            console.error('Error in handleDeleteUserProfile:', error);
            return { success: false, error: 'Internal server error during deletion' };
        }
    }
}

module.exports = Useradmin_deleteuserprofileBoundary;