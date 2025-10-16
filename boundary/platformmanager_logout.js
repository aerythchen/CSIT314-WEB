const LogoutController = require('../controller/platformmanager_logout');

class LogoutBoundary {
    constructor() {
        this.controller = new LogoutController();
    }

    displayLogoutConfirmation() {
        console.log('=== Platform Manager Logout ===');
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
