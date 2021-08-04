module.exports = function(sequelize, DataTypes) {
    return sequelize.define('feature', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        tags: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        prerequisites: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        class_feature_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'feature',
                key: 'id',
            },
        },
        branch_feature_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'feature',
                key: 'id',
            },
        },
        frequency_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'frequency',
                key: 'id',
            },
        },
        ap_cost: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'action',
                key: 'id',
            },
        },
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'feature',
        timestamps: false,
        indexes: [
            {
                name: 'feature_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'feature_class_feature_id',
                fields: [
                    { name: 'class_feature_id' },
                ],
            },
            {
                name: 'feature_branch_feature_id',
                fields: [
                    { name: 'branch_feature_id' },
                ],
            },
            {
                name: 'feature_frequency_id',
                fields: [
                    { name: 'frequency_id' },
                ],
            },
            {
                name: 'feature_action_id',
                fields: [
                    { name: 'action_id' },
                ],
            },
        ],
    });
};
