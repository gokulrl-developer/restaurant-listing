import { Router } from "express";
import RestaurantController from "../controllers/implementations/restaurant.controller.js"
import { Routes } from "../constants/routes.js";
import RestaurantRepository from "../repository/implementations/restaurant.repository.js";
import RestaurantService from "../services/implementations/restaurant.service.js";

const restaurantRepository=new RestaurantRepository();
const restaurantService=new RestaurantService(restaurantRepository);
const restaurantController=new RestaurantController(restaurantService);

const router=Router();

router.post(Routes.CREATE_RESTAURANT,restaurantController.createRestaurant.bind(restaurantController))
router.get(Routes.LIST_RESTAURANTS,restaurantController.listRestaurants.bind(restaurantController))
router.patch(Routes.UPDATE_RESTAURANT,restaurantController.updateRestaurant.bind(restaurantController))
router.delete(Routes.REMOVE_RESTAURANT,restaurantController.removeRestaurant.bind(restaurantController))

export default router