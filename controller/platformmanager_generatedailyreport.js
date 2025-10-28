const Match = require('../entity/Match');

class GenerateDailyReportController {
    constructor() {
        this.entity = new Match();
    }

    async generateDailyReport(data) {
        console.log("GenerateDailyReportController: Processing daily report generation...");
        
        // Use Match entity to generate daily report
        const reportDate = data.date || new Date().toISOString().split('T')[0];
        const startDate = reportDate;
        const endDate = reportDate;
        
        return await this.entity.getMatchStatistics(startDate, endDate);
    }

    //additional method over engineering here
    async getRequestTrends(data) {
        console.log("GenerateDailyReportController: Processing request trends...");
        
        // Use Match entity to get request trends
        const days = data.days || 30;
        return await this.entity.getRequestTrends(days);
    }
}

module.exports = GenerateDailyReportController;

