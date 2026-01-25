import db from "../../models/index.js";
import IRestaurantRepository, { IRestaurant } from "../interfaces/restaurant.respository.js";

export default class RestaurantRepository implements IRestaurantRepository{
 async findByNameAndAddress(name: string, address: string): Promise<IRestaurant | null> {
     return await db.Restaurant.findOne({
            where: { name, address }
        });
 }

 async create(restaurant:IRestaurant):Promise<IRestaurant>{
    const {name,address,contact}=restaurant;
  return await db.Restaurant.create({ name, address, contact, createdAt: new Date(), updatedAt: new Date() })
 }

 async findAll(): Promise<IRestaurant[]> {
    return await db.Restaurant.findAll({
                 attributes: [
                     'id',
                     'name',
                     'address',
                     'contact'
                 ],
                 order: [
                     ['name', 'ASC']
                 ]
             });
 }

 async findById(restaurantId: number): Promise<IRestaurant | null> {
     return await db.Restaurant.findOne({
            where: { id: restaurantId }
        });
 }

 async update(restaurantUpdates: Partial<Omit<IRestaurant, "createdAt" | "updatedAt">>,restaurantId:string): Promise<number> {
     const [updatedCount]= await db.Restaurant.update(restaurantUpdates, {
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