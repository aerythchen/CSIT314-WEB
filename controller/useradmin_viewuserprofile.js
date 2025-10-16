const ViewUserProfileEntity = require('../entity/useradmin_viewuserprofile');

class ViewUserProfileController {
    constructor() {
        this.entity = new ViewUserProfileEntity();
        this.entity.initialize();
    }

    viewUserProfile(userId) {
        console.log("ViewUserProfileController: Processing view profile request...");
        
        if (!userId || userId.trim() === "") {
            return {
                success: false,
                error: "User ID is required",
                profile: null
            };
        }
        
        return this.processViewRequest(userId);
    }

    getAllUserProfiles() {
        console.log("ViewUserProfileController: Processing get all profiles request...");
        
        const entityResult = this.entity.process({
            action: "getAll"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profiles: []
            };
        }
        
        const profilesData = this.entity.getData();
        
        console.log(`Retrieved ${profilesData.data.profiles.length} profiles`);
        
        return {
            success: true,
            profiles: profilesData.data.profiles,
            count: profilesData.data.count
        };
    }

    processViewRequest(userId) {
        console.log(`Processing view request for user: ${userId}...`);
        
        const entityResult = this.entity.process({
            action: "getById",
            userId: userId
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profile: null
            };
        }
        
        const profileData = this.entity.getData();
        
        if (!profileData.data.profile) {
            return {
                success: false,
                error: "Profile not found",
                profile: null
            };
        }
        
        console.log(`Profile retrieved: ${profileData.data.profile.email}`);
        
        return {
            success: true,
            profile: profileData.data.profile
        };
    }
}

module.exports = ViewUserProfileController;

