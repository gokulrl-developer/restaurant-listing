export interface CreateRestaurantDTO {
    name: string,
    address: string,
    contact: string
}

export interface UpdateRestaurantDTO {
    restaurantId: number,
    name?: string,
    address?: string,
    contact?: string
}