const CSRRepresentative = require('../entity/CSRRepresentative');

class LoginController {
    constructor() {
        this.entity = new CSRRepresentative();
    }

    login(data) {
        const { email, password } = data;
        
        // Validate credentials
        const validationResult = this.validateCredentials(email, password);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                user: null
            };
        }
        
        // Use consolidated entity method directly
        const result = this.entity.login(email, password);
        return result;
    }

    validateCredentials(email, password) {
        // Check if email is provided
        if (!email || email.trim() === "") {
            return { isValid: false, error: "Email is required" };
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Invalid email format" };
        }
        
        // Check if password is provided
        if (!password || password.trim() === "") {
            return { isValid: false, error: "Password is required" };
        }
        
        // Check password length
        if (password.length < 6) {
            return { isValid: false, error: "Password must be at least 6 characters" };
        }
        
        return { isValid: true };
    }
}

module.exports = LoginController;

