export default interface IRestaurantRepository{
    findByNameAndAddress(name:string,address:string):Promise<IRestaurant | null>,
    create(restaurant:IRestaurant):Promise<IRestaurant>,
    findAll():Promise<IRestaurant[]>,
    findById(restaurantId:number):Promise<IRestaurant| null>,
    update(restaurantUpdates:RestaurantUpdates,restaurantId:string):Promise<number>,
    removeById(restaurantId:number):Promise<number>
}

export interface IRestaurant{
    id?:number,
    name:string,
    address:string,
    contact:string,
    createdAt:Date,
    updatedAt:Date
}

export interface RestaurantUpdates{
    name?:string,
    address?:string,
    contact?:string,
}