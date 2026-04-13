export interface Restaurant {
    restaurantId: number,
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
export interface CreateRestaurantResponse {
    message: string,
    restaurant: Restaurant
}

export interface RestaurantValidationError {
    nameError: string[],
    streetError: string[],
    cityError: string[],
    stateError: string[],
    countryError: string[],
    postalCodeError: string[],
    contactError: string[]
}

export interface RestaurantInput {
    name: string,
    address: AddressInput,
    contact: string
}

export interface AddressInput {
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
}

export interface ListRestaurantsResponse {
    restaurants: Restaurant[]
}

export interface RestaurantUpdateInput {
    restaurantId: string,
    name?: string,
    address?: AddressUpdateInput,
    contact?: string
}

export interface AddressUpdateInput {
    street?: string,
    city?: string,
    state?: string,
    country?: string,
    postalCode?: string
}

export interface UpdateRestaurantResponse {
    message: string,
    restaurant: Restaurant
}

export interface RemoveRestaurantResponse {
    message: string
}