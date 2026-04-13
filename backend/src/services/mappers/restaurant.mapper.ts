import { IAddress } from "../../repository/interfaces/address.repository.js";
import { IRestaurant, RestaurantUpdates, RestaurantWithAddress } from "../../repository/interfaces/restaurant.respository.js";
import { CreateRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dto.js";
import { CreateResponse, ListResponseItem, UpdateResponse } from "../interfaces/restaurant.service.interface.js";

export const createDTOToRecord=(createDTO:CreateRestaurantDTO,addressId:number):IRestaurant=>{
    return {
        name:createDTO.name,
        contact:createDTO.contact,
        addressId:addressId,
        createdAt:new Date(),
        updatedAt:new Date()
    }
}

export const recordToCreateResponse=(restaurant:IRestaurant,address:IAddress):CreateResponse=>{
    return {
        restaurantId:restaurant.id!,
        name:restaurant.name,
        address:{
            addressId:address.id!,
            street:address.street,
            city:address.city,
            state:address.state,
            country:address.country,
            postalCode:address.postalCode
        },
        contact:restaurant.contact
    }
}

export const recordToListResponseItem=(restaurant:RestaurantWithAddress):ListResponseItem=>{
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
        ...(updateDTO.address && {address:updateDTO.address}),
        ...(updateDTO.contact && {contact:updateDTO.contact}),
    }
}

export const recordToUpdateResponse=(restaurant:IRestaurant,address:IAddress):UpdateResponse=>{
     return {
        restaurantId:restaurant.id!,
        name:restaurant.name,
        address:{
            addressId:address.id!,
            street:address.street,
            city:address.city,
            state:address.state,
            country:address.country,
            postalCode:address.postalCode
        },
        contact:restaurant.contact
    }
}