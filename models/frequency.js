module.exports = function(sequelize, DataTypes) {
    return sequelize.define('frequency', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        tableName: 'frequency',
        timestamps: false,
        indexes: [
            {
                name: 'frequency_value',
                unique: true,
                fields: [
                    { name: 'value' },
                ],
            },
        ],
    });
};
