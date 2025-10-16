class InMemoryDB {
    constructor() {
        if (InMemoryDB.instance) {
            return InMemoryDB.instance;
        }
        this.tables = {};
        this.counters = {};
        InMemoryDB.instance = this;
    }

    static getInstance() {
        if (!InMemoryDB.instance) {
            InMemoryDB.instance = new InMemoryDB();
        }
        return InMemoryDB.instance;
    }

    createTable(tableName) {
        if (!this.tables[tableName]) {
            this.tables[tableName] = [];
            this.counters[tableName] = 1;
        }
    }

    insert(tableName, data) {
        if (!this.tables[tableName]) {
            throw new Error(`Table '${tableName}' does not exist`);
        }
        if (!data.id) {
            data.id = `${tableName}_${this.counters[tableName]++}`;
        }
        const now = new Date().toISOString();
        data.createdAt = data.createdAt || now;
        data.updatedAt = now;
        if (data.isDeleted === undefined) {
            data.isDeleted = false;
        }
        this.tables[tableName].push({ ...data });
        return { success: true, data: { ...data } };
    }

    find(tableName, conditions = {}) {
        if (!this.tables[tableName]) {
            return [];
        }
        return this.tables[tableName].filter(item => {
            if (item.isDeleted) return false;
            for (const [key, value] of Object.entries(conditions)) {
                if (item[key] !== value) return false;
            }
            return true;
        });
    }

    findOne(tableName, conditions = {}) {
        const results = this.find(tableName, conditions);
        return results.length > 0 ? results[0] : null;
    }

    findById(tableName, id) {
        if (!this.tables[tableName]) {
            return null;
        }
        return this.tables[tableName].find(item => item.id === id && !item.isDeleted) || null;
    }

    update(tableName, id, updateData) {
        if (!this.tables[tableName]) {
            throw new Error(`Table '${tableName}' does not exist`);
        }
        const item = this.tables[tableName].find(item => item.id === id && !item.isDeleted);
        if (!item) {
            throw new Error(`Item with id '${id}' not found in table '${tableName}'`);
        }
        Object.assign(item, updateData);
        item.updatedAt = new Date().toISOString();
        return { success: true, data: { ...item } };
    }

    softDelete(tableName, id) {
        return this.update(tableName, id, { isDeleted: true });
    }

    hardDelete(tableName, id) {
        if (!this.tables[tableName]) {
            throw new Error(`Table '${tableName}' does not exist`);
        }
        const index = this.tables[tableName].findIndex(item => item.id === id);
        if (index === -1) {
            throw new Error(`Item with id '${id}' not found in table '${tableName}'`);
        }
        this.tables[tableName].splice(index, 1);
        return { success: true };
    }

    count(tableName, conditions = {}) {
        return this.find(tableName, conditions).length;
    }

    searchMultipleFields(tableName, searchTerm, fields) {
        if (!this.tables[tableName]) {
            return [];
        }
        const term = searchTerm.toLowerCase();
        return this.tables[tableName].filter(item => {
            if (item.isDeleted) return false;
            return fields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }
}

module.exports = InMemoryDB;
