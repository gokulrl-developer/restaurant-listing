import {
    Model,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    Sequelize
} from "sequelize";

export default class Address extends Model<
    InferAttributes<Address>,
    InferCreationAttributes<Address>
> {
    declare id: CreationOptional<number>;
    declare street: string;
    declare city: string;
    declare state: string;
    declare country: string;
    declare postalCode: string;


    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static initModel(sequelize: Sequelize) {
        Address.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                street: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                city: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                state: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                postalCode: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: "Addresses",
                modelName: "Address"
            }
        );
    }
     static associate(models: any) {
        Address.hasMany(models.Restaurant, {
            foreignKey: "addressId",
            as: "restaurants"
        });
    }
}