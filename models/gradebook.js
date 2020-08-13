module.exports = function(sequelize, DataTypes) {
    var Gradebook = sequelize.define("Gradebook", {
        assignment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        student: {
            type: DataTypes.STRING,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        required: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: true
        }

    });
    return Gradebook;
};