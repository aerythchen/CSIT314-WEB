const GenerateWeeklyReportController = require('../controller/platformmanager_generateweeklyreport');

class GenerateWeeklyReportBoundary {
    constructor() {
        this.controller = new GenerateWeeklyReportController();
    }

    displayGenerateWeeklyReportForm() {
        console.log('=== Generate Weekly Report ===');
        console.log('Generating weekly report...');
    }

    handleGenerateWeeklyReport(weekNumber, year) {
        console.log('GenerateWeeklyReportBoundary: Handling generate weekly report...');
        return this.controller.generateWeeklyReport(weekNumber, year);
    }

    displayGenerateWeeklyReportResult(result) {
        if (result.success) {
            console.log('✓ Weekly report generated successfully!');
            console.log(`Report ID: ${result.data.report.id}`);
            console.log(`Week: ${result.data.report.weekNumber} of ${result.data.report.year}`);
            console.log(`Total Requests: ${result.data.report.totalRequests}`);
        } else {
            console.log('✗ Failed to generate weekly report!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = GenerateWeeklyReportBoundary;
