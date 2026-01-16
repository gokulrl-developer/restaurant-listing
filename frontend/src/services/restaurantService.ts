import { RestaurantRoutes } from "../constants/RestaurantRoutes";
import type { CreateRestaurantResponse, ListRestaurantsResponse, RestaurantInput } from "../types/restaurant.types";
import axiosInstance from "./axiosInstance";

export const createRestaurantAPI=(payload:RestaurantInput)=>{
    return axiosInstance.post<CreateRestaurantResponse>(RestaurantRoutes.CREATE_RESTAURANT,payload).then(res=>res.data)
}
export const listRestaurantsAPI=()=>{
    return axiosInstance.get<ListRestaurantsResponse>(RestaurantRoutes.LIST_RESTAURANTS).then(res=>res.data)
}