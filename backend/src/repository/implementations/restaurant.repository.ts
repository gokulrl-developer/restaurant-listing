import db from "../../models/index.js";
import IRestaurantRepository, { IRestaurant, RestaurantWithAddress } from "../interfaces/restaurant.respository.js";

export default class RestaurantRepository implements IRestaurantRepository {
    async findByName(name: string): Promise<IRestaurant | null> {
        return await db.Restaurant.findOne({
            where: { name }
        });
    }

    async create(restaurant: IRestaurant): Promise<IRestaurant> {
        const { name, addressId, contact } = restaurant;
        return await db.Restaurant.create({ name, addressId, contact, createdAt: new Date(), updatedAt: new Date() })
    }

    async findAll(): Promise<RestaurantWithAddress[]> {
        const restaurants=await db.Restaurant.findAll({
            attributes: [
                'id',
                'name',
                'contact'
            ],
            include: [
                {
                    model: db.Address,
                    as: "address",
                    attributes: ['street', 'city', 'state', 'country', 'postalCode']
                }
            ],
            order: [
                ['name', 'ASC']
            ]
        });
        return restaurants as unknown as RestaurantWithAddress[];
    }

    async findById(restaurantId: number): Promise<IRestaurant | null> {
        return await db.Restaurant.findOne({
            where: { id: restaurantId }
        });
    }

    async update(restaurantUpdates: Partial<Omit<IRestaurant, "createdAt" | "updatedAt"|"addressId">>, restaurantId: number): Promise<number> {
        const [updatedCount] = await db.Restaurant.update(restaurantUpdates, {
            where: { id: restaurantId },
        });
        return updatedCount;
    }
    async removeById(restaurantId: number): Promise<number> {
        return await db.Restaurant.destroy({
            where: { id: restaurantId },
        });
    }
}