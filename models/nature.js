module.exports = function(sequelize, DataTypes) {
    return sequelize.define('nature', {
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
        increases_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'stat',
                key: 'id',
            },
        },
        decreases_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'stat',
                key: 'id',
            },
        },
    }, {
        sequelize,
        tableName: 'nature',
        timestamps: false,
        indexes: [
            {
                name: 'nature_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'nature_increases_id',
                fields: [
                    { name: 'increases_id' },
                ],
            },
            {
                name: 'nature_decreases_id',
                fields: [
                    { name: 'decreases_id' },
                ],
            },
        ],
    });
};
