const GenerateDailyReportEntity = require('../entity/PlatformManager');

class GenerateDailyReportController {
    constructor() {
        this.entity = new PlatformManager();
        this.entity.initialize();
    }

    generateDailyReport(data) {
        console.log("GenerateDailyReportController: Processing daily report generation...");
        
        // Validate report request
        const validationResult = this.validateReportRequest(date);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                report: null
            };
        }
        
        // Process report generation
        return this.processReportGeneration(date);
    }

    validateReportRequest(date) {
        console.log("Validating report request...");
        
        // If no date provided, use yesterday as default
        let reportDate = date;
        if (!reportDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            reportDate = yesterday.toISOString().split('T')[0];
            console.log(`No date provided, using default: ${reportDate}`);
        }
        
        // Validate date format
        const parsedDate = new Date(reportDate);
        if (isNaN(parsedDate.getTime())) {
            return {
                isValid: false,
                error: "Invalid date format"
            };
        }
        
        // Check if date is not in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsedDate.setHours(0, 0, 0, 0);
        
        if (parsedDate > today) {
            return {
                isValid: false,
                error: "Cannot generate report for future dates"
            };
        }
        
        // Check if date is not too old (e.g., more than 1 year ago)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (parsedDate < oneYearAgo) {
            return {
                isValid: false,
                error: "Cannot generate report for dates older than 1 year"
            };
        }
        
        return { isValid: true, date: reportDate };
    }

    processReportGeneration(date) {
        console.log(`Processing report generation for date: ${date}...`);
        
        // Use validation result to get the actual date
        const validationResult = this.validateReportRequest(date);
        const reportDate = validationResult.date;
        
        // Use Entity to generate report
        const entityResult = this.entity.process({
            reportDate: reportDate,
            reportType: "daily",
            generatedBy: "platformmanager"
        });
        
        if (!entityResult.success) {
            return {
                success: false,
                error: entityResult.error,
                report: null
            };
        }
        
        // Get generated report data
        const reportData = this.entity.getData();
        
        console.log(`Daily report generated successfully for ${reportDate}`);
        
        return {
            success: true,
            report: reportData.data,
            message: "Daily report generated successfully"
        };
    }
}

module.exports = GenerateDailyReportController;

