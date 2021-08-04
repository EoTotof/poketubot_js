module.exports = function(sequelize, DataTypes) {
    return sequelize.define('combatmaneuver', {
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
        action_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        accuracy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        range: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        effect: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'combatmaneuver',
        timestamps: false,
        indexes: [
            {
                name: 'combatmaneuver_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'combatmaneuver_action_id',
                fields: [
                    { name: 'action_id' },
                ],
            },
            {
                name: 'combatmaneuver_keyword_id',
                fields: [
                    { name: 'keyword_id' },
                ],
            },
        ],
    });
};
