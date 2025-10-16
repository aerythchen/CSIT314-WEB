const LoginEntity = require('../entity/useradmin_login');

class LoginController {
    constructor() {
        this.entity = new LoginEntity();
        this.entity.initialize();
    }

    login(email, password) {
        console.log("LoginController: Processing User Admin login...");
        
        const validationResult = this.validateCredentials(email, password);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                user: null
            };
        }
        
        return this.processLogin(email, password);
    }

    validateCredentials(email, password) {
        console.log("Validating credentials...");
        
        if (!email || email.trim() === "") {
            return { isValid: false, error: "Email is required" };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Invalid email format" };
        }
        
        if (!password || password.trim() === "") {
            return { isValid: false, error: "Password is required" };
        }
        
        if (password.length < 8) {
            return { isValid: false, error: "Admin password must be at least 8 characters" };
        }
        
        return { isValid: true };
    }

    processLogin(email, password) {
        console.log(`Processing login for ${email}...`);
        
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

