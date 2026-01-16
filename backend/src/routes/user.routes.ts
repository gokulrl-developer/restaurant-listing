import { Router } from "express";
import { Routes } from "../constants/routes";
import * as RestaurantController from "../controllers/restaurant.controller.js"

const router=Router();

router.post(Routes.CREATE_RESTAURANT,RestaurantController.createRestaurant)
router.get(Routes.LIST_RESTAURANTS,RestaurantController.listRestaurants)

export default router