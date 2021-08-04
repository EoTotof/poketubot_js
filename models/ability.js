module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ability', {
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
        frequency_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'frequency',
                key: 'id',
            },
        },
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'action',
                key: 'id',
            },
        },
        keyword_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'keyword',
                key: 'id',
            },
        },
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        trigger: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        target: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'ability',
        timestamps: false,
        indexes: [
            {
                name: 'ability_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'ability_frequency_id',
                fields: [
                    { name: 'frequency_id' },
                ],
            },
            {
                name: 'ability_action_id',
                fields: [
                    { name: 'action_id' },
                ],
            },
            {
                name: 'ability_keyword_id',
                fields: [
                    { name: 'keyword_id' },
                ],
            },
        ],
    });
};
