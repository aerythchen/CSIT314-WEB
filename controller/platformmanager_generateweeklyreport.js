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
        // Handle ISO week format (e.g., "2024-W01")
        if (week.includes('-W')) {
            const [year, weekNum] = week.split('-W');
            const startDate = this.getDateOfISOWeek(parseInt(year), parseInt(weekNum));
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            return [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
        } else {
            // Fallback for regular date format
            const startDate = new Date(week);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            return [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
        }
    }

    getDateOfISOWeek(year, week) {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dow = simple.getDay();
        const ISOweekStart = simple;
        if (dow <= 4) {
            ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
        } else {
            ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
        }
        return ISOweekStart;
    }
}

module.exports = GenerateWeeklyReportController;

