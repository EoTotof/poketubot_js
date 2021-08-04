module.exports = function(sequelize, DataTypes) {
    return sequelize.define('stat', {
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
        abbreviation: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        contest_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'contesttype',
                key: 'id',
            },
        },
        taste: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'stat',
        timestamps: false,
        indexes: [
            {
                name: 'stat_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'stat_contest_type_id',
                fields: [
                    { name: 'contest_type_id' },
                ],
            },
        ],
    });
};
