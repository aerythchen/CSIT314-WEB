const SearchReportController = require('../controller/platformmanager_searchreport');

class SearchReportBoundary {
    constructor() {
        this.controller = new SearchReportController();
    }

    displaySearchReportForm() {
        console.log('=== Search Report ===');
        console.log('Please enter search criteria for reports:');
    }

    handleSearchReport(searchCriteria) {
        console.log('SearchReportBoundary: Handling search report...');
        return this.controller.searchReport(searchCriteria);
    }

    displaySearchReportResult(result) {
        if (result.success) {
            console.log('✓ Report search completed successfully!');
            console.log(`Found ${result.data.reports.length} reports:`);
            result.data.reports.forEach(report => {
                console.log(`- ${report.title} (${report.type})`);
            });
        } else {
            console.log('✗ Report search failed!');
            console.log(`Error: ${result.error}`);
        }
    }

    displayError(message) {
        console.log(`Error: ${message}`);
    }
}

module.exports = SearchReportBoundary;
