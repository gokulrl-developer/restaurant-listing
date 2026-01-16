export const RestaurantRoutes = {
    CREATE_RESTAURANT: "/restaurants",
    LIST_RESTAURANTS: "/restaurants",
    UPDATE_RESTAURANT: (restaurantId:string)=>`/restaurants/${restaurantId}`,
    REMOVE_RESTAURANT:(restaurantId:string)=>`/restaurants/${restaurantId}`
} as const;