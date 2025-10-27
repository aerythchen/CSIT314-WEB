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
}

module.exports = GenerateDailyReportController;

