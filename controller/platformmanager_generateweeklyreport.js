const Match = require('../entity/Match');

class GenerateWeeklyReportController {
    constructor() {
        this.entity = new Match();
    }

    async generateWeeklyReport(data) {
        console.log("GenerateWeeklyReportController: Processing weekly report generation...");
        
        // Use Match entity to generate weekly report
        const week = data.week || this.getLastWeek();
        const [startDate, endDate] = this.parseWeekRange(week);
        
        return await this.entity.getMatchStatistics(startDate, endDate);
    }

    getLastWeek() {
        const today = new Date();
        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - today.getDay() - 6);
        return lastMonday.toISOString().split('T')[0];
    }

    parseWeekRange(week) {
        const startDate = new Date(week);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
    }
}

module.exports = GenerateWeeklyReportController;

