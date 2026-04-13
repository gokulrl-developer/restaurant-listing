import { IAddress } from "../../repository/interfaces/address.repository.js"
import { Address } from "../dtos/restaurant.dto.js"

export const createDTOToRecord=(address:Address):IAddress=>{
    return {
        street:address.street,
        city:address.city,
        state:address.state,
        country:address.country,
        postalCode:address.postalCode,
        createdAt:new Date(),
        updatedAt:new Date()
    }
}