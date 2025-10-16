const LogoutController = require('../controller/csrrepresentative_logout');

class LogoutBoundary {
    constructor() {
        this.controller = new LogoutController();
    }
    onClick() {
        console.log('CsrrepresentativeLogoutBoundary: User clicked action button');
        this.displayForm();
    }

    displayLogoutConfirmation() {
        console.log('=== CSR Representative Logout ===');
        console.log('Are you sure you want to logout?');
    }

    handleLogout(userId) {
        console.log('LogoutBoundary: Handling logout request...');
        return this.controller.logout(userId);
    }

    displayLogoutResult(result) {
        if (result.success) {
            console.log('✓ Logout successful!');
            console.log('You have been logged out.');
        } else {
            console.log('✗ Logout Failed!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = LogoutBoundary;
