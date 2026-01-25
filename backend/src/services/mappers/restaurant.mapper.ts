import { IRestaurant, RestaurantUpdates } from "../../repository/interfaces/restaurant.respository.js";
import { CreateRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dto.js";
import { CreateResponse, ListResponseItem, UpdateResponse } from "../interfaces/restaurant.service.interface.js";

export const createDTOToRecord=(createDTO:CreateRestaurantDTO):IRestaurant=>{
    return {
        ...createDTO,
        createdAt:new Date(),
        updatedAt:new Date()
    }
}

export const recordToCreateResponse=(restaurant:IRestaurant):CreateResponse=>{
    return {
        restaurantId:restaurant.id!,
        name:restaurant.name,
        address:restaurant.address,
        contact:restaurant.contact
    }
}

export const recordToListResponseItem=(restaurant:IRestaurant):ListResponseItem=>{
    return {
        restaurantId:restaurant.id!,
        name:restaurant.name,
        address:restaurant.address,
        contact:restaurant.contact
    }
}

export const updateDTOToRecord=(updateDTO:UpdateRestaurantDTO):RestaurantUpdates=>{
    return {
        ...(updateDTO.name && {name:updateDTO.name}),
        ...(updateDTO.address && {name:updateDTO.address}),
        ...(updateDTO.contact && {name:updateDTO.contact}),
    }
}

export const recordToUpdateResponse=(restaurant:IRestaurant):UpdateResponse=>{
     return {
        restaurantId:restaurant.id!,
        name:restaurant.name,
        address:restaurant.address,
        contact:restaurant.contact
    }
}