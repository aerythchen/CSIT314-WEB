const LoginEntity = require('../entity/platformmanager_login');

class LoginController {
    constructor() {
        this.entity = new LoginEntity();
        this.entity.initialize();
    }

    login(email, password) {
        console.log("LoginController: Processing Platform Manager login...");
        
        // Validate credentials
        const validationResult = this.validateCredentials(email, password);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                user: null
            };
        }
        
        // Process the login
        return this.processLogin(email, password);
    }

    validateCredentials(email, password) {
        console.log("Validating credentials...");
        
        // Check if email is provided
        if (!email || email.trim() === "") {
            return {
                isValid: false,
                error: "Email is required"
            };
        }
        
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                isValid: false,
                error: "Invalid email format"
            };
        }
        
        // Check if password is provided
        if (!password || password.trim() === "") {
            return {
                isValid: false,
                error: "Password is required"
            };
        }
        
        // Check password length
        if (password.length < 8) {
            return {
                isValid: false,
                error: "Platform Manager password must be at least 8 characters"
            };
        }
        
        return { isValid: true };
    }

    processLogin(email, password) {
        console.log(`Processing login for ${email}...`);
        
        // Use Entity to authenticate and create session
        const entityResult = this.entity.process({
            email: email,
            password: password
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                user: null
            };
        }
        
        // Get stored data from entity
        const userData = this.entity.getData();
        
        console.log("Login successful");
        
        return {
            success: true,
            data: {
                user: userData.data.user,
                session: userData.data.session
            },
            message: "Login successful"
        };
    }
}

module.exports = LoginController;

