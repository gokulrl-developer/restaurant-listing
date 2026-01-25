import { CreateRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dto.js"

export default interface IRestaurantService {
    create(createDTO: CreateRestaurantDTO): Promise<CreateResponse>,
    list(): Promise<ListResponseItem[]>,
    update(updateDTO: UpdateRestaurantDTO): Promise<UpdateResponse>,
    removeById(restaurantId: number): Promise<void>
}

export interface CreateResponse {
    restaurantId: number,
    name: string,
    address: string,
    contact: string
}

export interface ListResponseItem {
    restaurantId: number,
    name: string,
    address: string,
    contact: string
}

export interface UpdateResponse {
    restaurantId: number,
    name: string,
    address: string,
    contact: string
}