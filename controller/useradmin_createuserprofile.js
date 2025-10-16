const CreateUserProfileEntity = require('../entity/UserAdmin');

class CreateUserProfileController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    createUserProfile(data) {
        console.log("CreateUserProfileController: Processing profile creation...");
        
        const validationResult = this.validateUserProfile(firstName, lastName, email, userType);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                profile: null
            };
        }
        
        return this.processUserCreation(firstName, lastName, email, userType);
    }

    validateUserProfile(firstName, lastName, email, userType) {
        console.log("Validating user profile data...");
        
        if (!firstName || firstName.trim() === "") {
            return { isValid: false, error: "First name is required" };
        }
        
        if (firstName.length < 2) {
            return { isValid: false, error: "First name must be at least 2 characters" };
        }
        
        if (!lastName || lastName.trim() === "") {
            return { isValid: false, error: "Last name is required" };
        }
        
        if (lastName.length < 2) {
            return { isValid: false, error: "Last name must be at least 2 characters" };
        }
        
        if (!email || email.trim() === "") {
            return { isValid: false, error: "Email is required" };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Invalid email format" };
        }
        
        if (!userType || userType.trim() === "") {
            return { isValid: false, error: "User type is required" };
        }
        
        const validUserTypes = ["csrrepresentative", "personinneed", "platformmanager", "useradmin"];
        if (!validUserTypes.includes(userType.toLowerCase())) {
            return { isValid: false, error: "Invalid user type" };
        }
        
        return { isValid: true };
    }

    processUserCreation(firstName, lastName, email, userType) {
        console.log(`Processing creation of profile for: ${firstName} ${lastName}...`);
        
        const entityResult = this.entity.process({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            userType: userType.toLowerCase()
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                profile: null
            };
        }
        
        const profileData = this.entity.getData();
        
        console.log(`Profile created successfully with ID: ${profileData.data.id}`);
        
        return {
            success: true,
            profile: profileData.data,
            message: "User profile created successfully"
        };
    }
}

module.exports = CreateUserProfileController;

