export interface Restaurant{
    restaurantId:number,
    name:string,
    address:string,
    contact:string
}

export interface CreateRestaurantResponse{
    message:string,
    restaurant:Restaurant
}

export interface RestaurantValidationError{
    nameError:string[],
    addressError:string[],
    contactError:string[]
}

export interface RestaurantInput{
    name:string,
    address:string,
    contact:string
}

export interface ListRestaurantsResponse{
    restaurants:Restaurant[]
}

export interface RestaurantUpdateInput{
    restaurantId:string,
    name?:string,
    address?:string,
    contact?:string
}

export interface UpdateRestaurantResponse{
    message:string,
    restaurant:Restaurant
}