import { RestaurantRoutes } from "../constants/RestaurantRoutes";
import type { CreateRestaurantResponse, RestaurantInput } from "../types/restaurant.types";
import axiosInstance from "./axiosInstance";

export const createRestaurantAPI=(payload:RestaurantInput)=>{
    return axiosInstance.post<CreateRestaurantResponse>(RestaurantRoutes.CREATE_RESTAURANT,payload).then(res=>res.data)
}