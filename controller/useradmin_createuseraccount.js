const CreateUserAccountEntity = require('../entity/UserAdmin');

class CreateUserAccountController {
    constructor() {
        this.entity = new UserAdmin();
        this.entity.initialize();
    }

    createUserAccount(data) {
        console.log("CreateUserAccountController: Processing account creation...");
        
        const validationResult = this.validateAccountCreation(profileId, username, password, confirmPassword);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                account: null
            };
        }
        
        return this.processAccountCreation(profileId, username, password);
    }

    validateAccountCreation(profileId, username, password, confirmPassword) {
        console.log("Validating account data...");
        
        if (!profileId || profileId.trim() === "") {
            return { isValid: false, error: "Profile ID is required" };
        }
        
        if (!username || username.trim() === "") {
            return { isValid: false, error: "Username is required" };
        }
        
        if (username.length < 3) {
            return { isValid: false, error: "Username must be at least 3 characters" };
        }
        
        if (username.length > 50) {
            return { isValid: false, error: "Username must not exceed 50 characters" };
        }
        
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(username)) {
            return { isValid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
        }
        
        if (!password || password.trim() === "") {
            return { isValid: false, error: "Password is required" };
        }
        
        if (password.length < 8) {
            return { isValid: false, error: "Password must be at least 8 characters" };
        }
        
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, error: "Password must contain at least one uppercase letter" };
        }
        
        if (!/[a-z]/.test(password)) {
            return { isValid: false, error: "Password must contain at least one lowercase letter" };
        }
        
        if (!/[0-9]/.test(password)) {
            return { isValid: false, error: "Password must contain at least one number" };
        }
        
        if (password !== confirmPassword) {
            return { isValid: false, error: "Passwords do not match" };
        }
        
        return { isValid: true };
    }

    processAccountCreation(profileId, username, password) {
        console.log(`Processing account creation for profile: ${profileId}...`);
        
        const entityResult = this.entity.process({
            profileId: profileId.trim(),
            username: username.trim(),
            password: password,
            createdBy: "useradmin"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                account: null
            };
        }
        
        const accountData = this.entity.getData();
        
        console.log(`Account created successfully: ${accountData.data.username}`);
        
        return {
            success: true,
            account: accountData.data,
            message: "User account created successfully"
        };
    }
}

module.exports = CreateUserAccountController;

