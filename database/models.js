const models = {
    userProfiles: {
        id: { type: 'string', required: true, unique: true },
        userType: { type: 'enum', enum: ['csrrepresentative', 'personinneed', 'platformmanager', 'useradmin'], required: true },
        status: { type: 'enum', enum: ['active', 'suspended', 'inactive'], default: 'active' }
    },
    userAccounts: {
        id: { type: 'string', required: true, unique: true },
        profileId: { type: 'string', required: true, foreignKey: 'userProfiles.id' },
        firstName: { type: 'string', required: true, minLength: 2 },
        lastName: { type: 'string', required: true, minLength: 2 },
        email: { type: 'string', required: true, unique: true, format: 'email' },
        passwordHash: { type: 'string', required: true },
        userType: { type: 'enum', enum: ['csrrepresentative', 'personinneed', 'platformmanager', 'useradmin'], required: true },
        status: { type: 'enum', enum: ['active', 'suspended', 'inactive'], default: 'active' },
        lastLogin: { type: 'datetime', required: false },
        loginAttempts: { type: 'number', default: 0 },
        createdAt: { type: 'datetime', default: 'now' },
        updatedAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    },
    categories: {
        id: { type: 'string', required: true, unique: true },
        name: { type: 'string', required: true, minLength: 2 },
        description: { type: 'string', required: false },
        status: { type: 'enum', enum: ['active', 'inactive'], default: 'active' },
        requestCount: { type: 'number', default: 0 },
        createdAt: { type: 'datetime', default: 'now' },
        updatedAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    },
    requests: {
        id: { type: 'string', required: true, unique: true },
        createdBy: { type: 'string', required: true, foreignKey: 'userProfiles.id' },
        createdByName: { type: 'string', required: true },
        categoryId: { type: 'string', required: true, foreignKey: 'categories.id' },
        categoryName: { type: 'string', required: true },
        title: { type: 'string', required: true, minLength: 5 },
        description: { type: 'string', required: true, minLength: 10 },
        urgency: { type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
        status: { type: 'enum', enum: ['pending', 'assigned', 'completed'], default: 'pending' },
        viewCount: { type: 'number', default: 0 },
        shortlistCount: { type: 'number', default: 0 },
        createdAt: { type: 'datetime', default: 'now' },
        updatedAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    },
    shortlists: {
        id: { type: 'string', required: true, unique: true },
        userId: { type: 'string', required: true, foreignKey: 'userProfiles.id' },
        requestId: { type: 'string', required: true, foreignKey: 'requests.id' },
        isActive: { type: 'boolean', default: true },
        createdAt: { type: 'datetime', default: 'now' },
        updatedAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    },
    sessions: {
        id: { type: 'string', required: true, unique: true },
        userId: { type: 'string', required: true, foreignKey: 'userProfiles.id' },
        token: { type: 'string', required: true, unique: true },
        expiresAt: { type: 'datetime', required: true },
        isActive: { type: 'boolean', default: true },
        createdAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    },
    matches: {
        id: { type: 'string', required: true, unique: true },
        requestId: { type: 'string', required: true, foreignKey: 'requests.id' },
        csrId: { type: 'string', required: true, foreignKey: 'userProfiles.id' },
        serviceType: { type: 'string', required: true },
        status: { type: 'enum', enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
        completedAt: { type: 'datetime', required: false },
        notes: { type: 'string', required: false },
        createdAt: { type: 'datetime', default: 'now' },
        updatedAt: { type: 'datetime', default: 'now' },
        isDeleted: { type: 'boolean', default: false }
    }
};

module.exports = models;
