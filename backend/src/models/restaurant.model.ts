import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize
} from "sequelize";
export default class Restaurant extends Model<
    InferAttributes<Restaurant>,
    InferCreationAttributes<Restaurant>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare address: string;
    declare contact: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static initModel(sequelize: Sequelize) {
        Restaurant.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                contact: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: "Restaurants",
                modelName: "Restaurant"
            }
        );
    }
}