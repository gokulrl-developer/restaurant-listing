import { RestaurantRoutes } from "../constants/RestaurantRoutes";
import type { CreateRestaurantResponse, ListRestaurantsResponse, RemoveRestaurantResponse, RestaurantInput, RestaurantUpdateInput, UpdateRestaurantResponse } from "../types/restaurant.types";
import axiosInstance from "./axiosInstance";

export const createRestaurantAPI=(payload:RestaurantInput)=>{
    return axiosInstance.post<CreateRestaurantResponse>(RestaurantRoutes.CREATE_RESTAURANT,payload).then(res=>res.data)
}
export const listRestaurantsAPI=()=>{
    return axiosInstance.get<ListRestaurantsResponse>(RestaurantRoutes.LIST_RESTAURANTS).then(res=>res.data)
}
export const updateRestaurantAPI=(payload:RestaurantUpdateInput)=>{
            const requestBody={
                name:payload.name,
                address:payload.address,
                contact:payload.contact
            }
    return axiosInstance.patch<UpdateRestaurantResponse>(RestaurantRoutes.UPDATE_RESTAURANT(payload.restaurantId),requestBody).then(res=>res.data)
}
export const removeRestaurantAPI=(restaurantId:string)=>{
    return axiosInstance.delete<RemoveRestaurantResponse>(RestaurantRoutes.REMOVE_RESTAURANT(restaurantId)).then(res=>res.data)
}

