const Match = require('../entity/Match');

class GenerateMonthlyReportController {
    constructor() {
        this.entity = new Match();
    }

    async generateMonthlyReport(data) {
        console.log("GenerateMonthlyReportController: Processing monthly report generation...");
        
        // Use Match entity to generate monthly report
        const month = data.month || this.getLastMonth();
        const [startDate, endDate] = this.parseMonthRange(month);
        
        return await this.entity.getMatchStatistics(startDate, endDate);
    }

    getLastMonth() {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return lastMonth.toISOString().substring(0, 7); // YYYY-MM format
    }

    parseMonthRange(month) {
        const [year, monthNum] = month.split('-');
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0); // Last day of the month
        return [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
    }
}

module.exports = GenerateMonthlyReportController;

