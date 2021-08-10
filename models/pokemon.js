const { normalizeString } = require('../utils');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('pokemon', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        form: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        form_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        has_form_cry: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        french_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        japanese_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        german_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        male_ratio: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        mega_form: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        search_string: {
            type: DataTypes.VIRTUAL,
            get() {
                let searchString = `#${normalizeString(this.name)}#`;
                searchString += `${normalizeString(this.french_name)}#`;
                searchString += `${normalizeString(this.german_name)}#`;
                searchString += `${normalizeString(this.japanese_name)}#`;
                return searchString;
            },
        },
    }, {
        sequelize,
        tableName: 'pokemon',
        timestamps: false,
    });
};
