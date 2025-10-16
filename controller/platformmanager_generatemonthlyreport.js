const GenerateMonthlyReportEntity = require('../entity/PlatformManager');

class GenerateMonthlyReportController {
    constructor() {
        this.entity = new PlatformManager();
        this.entity.initialize();
    }

    generateMonthlyReport(data) {
        console.log("GenerateMonthlyReportController: Processing monthly report generation...");
        
        // Validate report request
        const validationResult = this.validateReportRequest(month, year);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                report: null
            };
        }
        
        // Process report generation
        return this.processReportGeneration(validationResult.month, validationResult.year);
    }

    validateReportRequest(month, year) {
        console.log("Validating monthly report request...");
        
        // Default to last month if not provided
        let reportMonth = month;
        let reportYear = year;
        
        if (!reportMonth || !reportYear) {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            reportMonth = lastMonth.getMonth() + 1;
            reportYear = lastMonth.getFullYear();
            console.log(`No month/year provided, using last month: ${reportMonth}/${reportYear}`);
        }
        
        // Validate month
        const monthNum = parseInt(reportMonth);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return {
                isValid: false,
                error: "Month must be between 1 and 12"
            };
        }
        
        // Validate year
        const yearNum = parseInt(reportYear);
        if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
            return {
                isValid: false,
                error: "Year must be between 2000 and 2100"
            };
        }
        
        // Check if not in the future
        const today = new Date();
        const reportDate = new Date(yearNum, monthNum - 1, 1);
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        if (reportDate >= currentMonthStart) {
            return {
                isValid: false,
                error: "Cannot generate report for current or future months"
            };
        }
        
        return { isValid: true, month: monthNum, year: yearNum };
    }

    processReportGeneration(month, year) {
        console.log(`Processing monthly report generation for ${month}/${year}...`);
        
        // Use Entity to generate report
        const entityResult = this.entity.process({
            month: month,
            year: year,
            reportType: "monthly",
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
        
        console.log(`Monthly report generated successfully for ${month}/${year}`);
        
        return {
            success: true,
            report: reportData.data,
            message: "Monthly report generated successfully"
        };
    }
}

module.exports = GenerateMonthlyReportController;

