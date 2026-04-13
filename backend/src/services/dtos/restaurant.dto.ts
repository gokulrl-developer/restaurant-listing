export interface CreateRestaurantDTO {
    name: string,
    address: Address,
    contact: string
}

export interface Address {
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
}

export interface UpdateRestaurantDTO {
    restaurantId: number,
    name?: string,
    address?: Address,
    contact?: string
}
