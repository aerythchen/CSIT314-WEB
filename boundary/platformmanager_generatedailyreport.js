const GenerateDailyReportController = require('../controller/platformmanager_generatedailyreport');

class GenerateDailyReportBoundary {
    constructor() {
        this.controller = new GenerateDailyReportController();
    }

    displayGenerateDailyReportForm() {
        console.log('=== Generate Daily Report ===');
        console.log('Generating daily report...');
    }

    handleGenerateDailyReport(date) {
        console.log('GenerateDailyReportBoundary: Handling generate daily report...');
        return this.controller.generateDailyReport(date);
    }

    displayGenerateDailyReportResult(result) {
        if (result.success) {
            console.log('✓ Daily report generated successfully!');
            console.log(`Report ID: ${result.data.report.id}`);
            console.log(`Date: ${result.data.report.date}`);
            console.log(`Total Requests: ${result.data.report.totalRequests}`);
        } else {
            console.log('✗ Failed to generate daily report!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = GenerateDailyReportBoundary;
