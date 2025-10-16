const GenerateWeeklyReportEntity = require('../entity/PlatformManager');

class GenerateWeeklyReportController {
    constructor() {
        this.entity = new PlatformManager();
        this.entity.initialize();
    }

    generateWeeklyReport(data) {
        console.log("GenerateWeeklyReportController: Processing weekly report generation...");
        
        // Validate report request
        const validationResult = this.validateReportRequest(startDate, endDate);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error,
                report: null
            };
        }
        
        // Process report generation
        return this.processReportGeneration(validationResult.startDate, validationResult.endDate);
    }

    validateReportRequest(startDate, endDate) {
        console.log("Validating weekly report request...");
        
        // Default to last week if no dates provided
        let weekStart = startDate;
        let weekEnd = endDate;
        
        if (!weekStart || !weekEnd) {
            const today = new Date();
            const lastMonday = new Date(today);
            lastMonday.setDate(today.getDate() - today.getDay() - 6);
            const lastSunday = new Date(lastMonday);
            lastSunday.setDate(lastMonday.getDate() + 6);
            
            weekStart = lastMonday.toISOString().split('T')[0];
            weekEnd = lastSunday.toISOString().split('T')[0];
            console.log(`No dates provided, using last week: ${weekStart} to ${weekEnd}`);
        }
        
        // Validate date formats
        const start = new Date(weekStart);
        const end = new Date(weekEnd);
        
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return {
                isValid: false,
                error: "Invalid date format"
            };
        }
        
        // Validate date range
        if (start > end) {
            return {
                isValid: false,
                error: "Start date cannot be after end date"
            };
        }
        
        // Check if dates are not in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (end > today) {
            return {
                isValid: false,
                error: "Cannot generate report for future dates"
            };
        }
        
        // Validate week duration (should be approximately 7 days)
        const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (daysDiff < 6 || daysDiff > 8) {
            return {
                isValid: false,
                error: "Weekly report should cover approximately 7 days"
            };
        }
        
        return { isValid: true, startDate: weekStart, endDate: weekEnd };
    }

    processReportGeneration(startDate, endDate) {
        console.log(`Processing weekly report generation for ${startDate} to ${endDate}...`);
        
        // Use Entity to generate report
        const entityResult = this.entity.process({
            startDate: startDate,
            endDate: endDate,
            reportType: "weekly",
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
        
        console.log(`Weekly report generated successfully for ${startDate} to ${endDate}`);
        
        return {
            success: true,
            report: reportData.data,
            message: "Weekly report generated successfully"
        };
    }
}

module.exports = GenerateWeeklyReportController;

