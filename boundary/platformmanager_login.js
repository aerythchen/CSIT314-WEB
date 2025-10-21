const platformmanager_login = require('../controller/platformmanager_login');

class Platformmanager_loginBoundary {
    constructor() {
        this.controller = new platformmanager_login();
    }

    handleLogin(data) {
        try {
            // Validate inputs
            const validationError = this.validateInputs(data);
            if (validationError) {
                return { success: false, error: validationError };
            }
            
            // Call controller with formatted data
            const result = this.controller.login({
                email: data.email,
                password: data.password,
                userType: 'platformmanager'
            });
            
            // Add redirect URL for successful login
            if (result.success) {
                return { ...result, redirectUrl: '/platformmanager/dashboard' };
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message || "An unexpected error occurred" };
        }
    }
    
    validateInputs(data) {
        // Check if email is provided
        if (!data.email || data.email === "") {
            return "Email is required";
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return "Invalid email format";
        }
        
        // Check if password is provided
        if (!data.password || data.password === "") {
            return "Password is required";
        }
        
        // Check password length
        if (data.password.length < 6) {
            return "Password must be at least 6 characters";
        }
        
        return null; // No validation errors
    }
}

module.exports = Platformmanager_loginBoundary;