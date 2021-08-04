const { normalizeString } = require('../utils');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('move', {
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
        french_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'type',
                key: 'id',
            },
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'category',
                key: 'id',
            },
        },
        db_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'damagebase',
                key: 'value',
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
            allowNull: true,
        },
        contest_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'contesttype',
                key: 'id',
            },
        },
        contest_effect_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'contesteffect',
                key: 'id',
            },
        },
        metronome: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        search_string: {
            type: DataTypes.VIRTUAL,
            get() {
                let searchString = `#${normalizeString(this.name)}#`;
                if (this.french_name) {
                    searchString += `${normalizeString(this.french_name)}#`;
                }
                return searchString;
            },
        },
    }, {
        sequelize,
        tableName: 'move',
        timestamps: false,
        indexes: [
            {
                name: 'move_name',
                unique: true,
                fields: [
                    { name: 'name' },
                ],
            },
            {
                name: 'move_type_id',
                fields: [
                    { name: 'type_id' },
                ],
            },
            {
                name: 'move_category_id',
                fields: [
                    { name: 'category_id' },
                ],
            },
            {
                name: 'move_db_id',
                fields: [
                    { name: 'db_id' },
                ],
            },
            {
                name: 'move_frequency_id',
                fields: [
                    { name: 'frequency_id' },
                ],
            },
            {
                name: 'move_contest_type_id',
                fields: [
                    { name: 'contest_type_id' },
                ],
            },
            {
                name: 'move_contest_effect_id',
                fields: [
                    { name: 'contest_effect_id' },
                ],
            },
        ],
    });
};
