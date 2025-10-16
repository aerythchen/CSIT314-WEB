class ViewHistoryEntity {
    constructor() {
        this.historyRecords = [];
        this.userId = null;
        this.isInitialized = false;
    }

    initialize() {
        console.log("ViewHistoryEntity: Initializing...");
        this.historyRecords = [];
        this.userId = null;
        this.isInitialized = true;
        console.log("Entity initialized successfully");
        return { success: true, message: "Entity initialized" };
    }

    validate(data) {
        console.log("ViewHistoryEntity: Validating data...");
        
        if (!data) {
            return {
                isValid: false,
                error: "Data is required"
            };
        }

        // Validate user ID
        if (data.userId && (typeof data.userId !== 'string' && typeof data.userId !== 'number')) {
            return {
                isValid: false,
                error: "User ID must be a string or number"
            };
        }

        // Validate history records if provided
        if (data.records && !Array.isArray(data.records)) {
            return {
                isValid: false,
                error: "History records must be an array"
            };
        }

        console.log("Data validation passed");
        return { isValid: true };
    }

    process(data) {
        console.log("ViewHistoryEntity: Processing data...");
        
        // Validate before processing
        const validationResult = this.validate(data);
        if (!validationResult.isValid) {
            return {
                success: false,
                error: validationResult.error
            };
        }

        // Store user ID
        this.userId = data.userId;

        // Process history records
        if (data.records && Array.isArray(data.records)) {
            this.historyRecords = data.records.map(record => ({
                id: record.id || null,
                userId: record.userId || this.userId,
                action: record.action || "",
                opportunityTitle: record.opportunityTitle || "",
                date: record.date || new Date().toISOString().split('T')[0],
                time: record.time || new Date().toISOString().split('T')[1],
                serviceType: record.serviceType || "",
                duration: record.duration || null,
                additionalInfo: record.additionalInfo || ""
            }));
        }

        console.log(`Processed ${this.historyRecords.length} history records`);
        return {
            success: true,
            message: "History data processed",
            data: {
                userId: this.userId,
                recordCount: this.historyRecords.length
            }
        };
    }

    getData() {
        console.log("ViewHistoryEntity: Retrieving data...");
        
        if (!this.isInitialized) {
            return {
                success: false,
                error: "Entity not initialized",
                data: null
            };
        }

        // Sort records by date and time (most recent first)
        const sortedRecords = [...this.historyRecords].sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB - dateA;
        });

        return {
            success: true,
            data: {
                userId: this.userId,
                historyRecords: sortedRecords,
                totalRecords: sortedRecords.length,
                lastUpdated: new Date().toISOString()
            }
        };
    }
}

module.exports = ViewHistoryEntity;

