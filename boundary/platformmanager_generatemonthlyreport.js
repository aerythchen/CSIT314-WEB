const GenerateMonthlyReportController = require('../controller/platformmanager_generatemonthlyreport');

class GenerateMonthlyReportBoundary {
    constructor() {
        this.controller = new GenerateMonthlyReportController();
    }

    displayGenerateMonthlyReportForm() {
        console.log('=== Generate Monthly Report ===');
        console.log('Generating monthly report...');
    }

    handleGenerateMonthlyReport(month, year) {
        console.log('GenerateMonthlyReportBoundary: Handling generate monthly report...');
        return this.controller.generateMonthlyReport(month, year);
    }

    displayGenerateMonthlyReportResult(result) {
        if (result.success) {
            console.log('✓ Monthly report generated successfully!');
            console.log(`Report ID: ${result.data.report.id}`);
            console.log(`Month: ${result.data.report.month}/${result.data.report.year}`);
            console.log(`Total Requests: ${result.data.report.totalRequests}`);
        } else {
            console.log('✗ Failed to generate monthly report!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = GenerateMonthlyReportBoundary;
