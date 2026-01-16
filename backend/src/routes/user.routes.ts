import { Router } from "express";
import { Routes } from "../constants/routes";
import * as RestaurantController from "../controllers/restaurant.controller.js"

const router=Router();

router.post(Routes.CREATE_RESTAURANT,RestaurantController.createRestaurant)
router.get(Routes.LIST_RESTAURANTS,RestaurantController.listRestaurants)
router.patch(Routes.UPDATE_RESTAURANT,RestaurantController.updateRestaurant)
router.delete(Routes.REMOVE_RESTAURANT,RestaurantController.removeRestaurant)

export default router