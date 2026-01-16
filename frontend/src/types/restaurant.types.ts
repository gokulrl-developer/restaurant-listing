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