module.exports = function(sequelize, DataTypes) {
    return sequelize.define('typeeffectiveness', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        attacking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'type',
                key: 'id',
            },
        },
        defending_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'type',
                key: 'id',
            },
        },
        effectiveness: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'typeeffectiveness',
        timestamps: false,
        indexes: [
            {
                name: 'typeeffectiveness_attacking_id',
                fields: [
                    { name: 'attacking_id' },
                ],
            },
            {
                name: 'typeeffectiveness_defending_id',
                fields: [
                    { name: 'defending_id' },
                ],
            },
        ],
    });
};
