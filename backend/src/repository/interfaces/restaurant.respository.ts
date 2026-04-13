import { Address } from "../../services/dtos/restaurant.dto.js"

export default interface IRestaurantRepository{
    findByName(name:string):Promise<IRestaurant | null>,
    create(restaurant:IRestaurant):Promise<IRestaurant>,
    findAll():Promise<RestaurantWithAddress[]>,
    findById(restaurantId:number):Promise<IRestaurant| null>,
    update(restaurantUpdates:RestaurantUpdates,restaurantId:number):Promise<number>,
    removeById(restaurantId:number):Promise<number>
}

export interface IRestaurant{
    id?:number,
    name:string,
    addressId:number,
    contact:string,
    createdAt:Date,
    updatedAt:Date
}

export interface RestaurantUpdates{
    name?:string,
    contact?:string,
}

export interface RestaurantWithAddress{
     id?:number,
    name:string,
    address:Address,
    contact:string,
    createdAt:Date,
    updatedAt:Date
}