const Match = require('../entity/Match');

class SearchReportController {
    constructor() {
        this.entity = new Match();
    }

    async searchReport(data) {
        console.log("SearchReportController: Processing report search...");
        
        // Use Match entity to search for matches (which represent volunteer service usage)
        return await this.entity.searchMatches(
            data.searchTerm,
            data.serviceType,
            data.status,
            data.startDate,
            data.endDate
        );
    }
}

module.exports = SearchReportController;

