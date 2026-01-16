import { Router } from "express";
import { Routes } from "../constants/routes";
import * as RestaurantController from "../controllers/restaurant.controller.js"

const router=Router();

router.post(Routes.CREATE_RESTAURANT,RestaurantController.createRestaurant)

export default router