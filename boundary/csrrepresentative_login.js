const LoginController = require('../controller/csrrepresentative_login');

class LoginBoundary {
    constructor() {
        this.controller = new LoginController();
    }

    onClick() {
        console.log('LoginBoundary: User clicked login button');
        this.displayLoginForm();
    }

    displayLoginForm() {
        console.log('=== CSR Representative Login ===');
        console.log('Please enter your credentials:');
    }

    handleLogin(email, password) {
        console.log('LoginBoundary: Handling login submission...');
        return this.controller.login(email, password);
    }

    displayLoginResult(result) {
        if (result.success) {
            console.log('✓ Login successful!');
            console.log(`Welcome, ${result.data.user.firstName}!`);
        } else {
            console.log('✗ Login Failed!');
            console.log(`Error: ${result.error}`);
            console.log('[ Try Again ] [ Contact Support ]');
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = LoginBoundary;
