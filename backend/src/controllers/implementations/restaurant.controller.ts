import { Request, Response, NextFunction } from "express";
import { RegexValues } from "../../constants/regex-values.js";
import db from "../../models/index.js";
import { Messages } from "../../constants/messages.js";
import { StatusCodes } from "../../constants/status-codes.js";
import IRestaurantService from "../../services/interfaces/restaurant.service.interface.js";
import AppError from "../../error/AppError.js";

export default class RestaurantController {
    constructor(
        private readonly _restaurantService: IRestaurantService
    ) {

    }
    createRestaurant = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const { name, address, contact } = req.body;
            if (!name || typeof name !== "string") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.NAME_REQUIRED })
            }
            if (!address || typeof address !== "string") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.ADDRESS_REQUIRED })
            }

            if (!contact) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_REQUIRED })
            }

            if (typeof contact !== "string") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_INVALID })
            }
            const newRestaurant = await this._restaurantService.create({
                name, address, contact
            })

            res.status(StatusCodes.CREATED).json({
                restaurant: {
                    restaurantId: newRestaurant.restaurantId,
                    name: newRestaurant.name,
                    address: newRestaurant.address,
                    contacts: newRestaurant.contact
                }, message: Messages.RESTAURANT_CREATED
            });

        } catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                if (error.code === 'VALIDATION_ERROR') {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
                } else if (error.code === 'RESTAURANT_EXISTS') {
                    return res.status(StatusCodes.CONFLICT).json({ message: error.message })
                }
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
            }
        }
    }

    listRestaurants = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const restaurantList = await this._restaurantService.list();
                res.status(StatusCodes.OK).json({
                    restaurants: restaurantList
                });

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR })
        }
    }

    updateRestaurant = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            let restaurantId = req.params.restaurantId;
            if (!restaurantId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_REQUEST })
            }
            req.body.restaurantId=Number(restaurantId);
            if (req.body.name) {
                const name = req.body.name;
                if (typeof name !== "string") {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_NAME })
                }
            }

            if (req.body.address) {
                const address = req.body.address;
                if (typeof address !== "string") {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_ADDRESS })
                }
            }

            if (req.body.contact) {
                const contact = req.body.contact;
                if (!contact) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_REQUIRED })
                }
                if (typeof contact !== "string") {
                    return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_INVALID })
                }
            }
            
            const updatedRestaurant = await this._restaurantService.update(req.body)

            return res.status(StatusCodes.OK).json({
                message: Messages.RESTAURANT_UPDATED,
                restaurant: updatedRestaurant,
            });

        } catch (error) {
            if(error instanceof AppError){
                if(error.code==="VALIDATION_ERROR"){
                    return res.status(StatusCodes.BAD_REQUEST).json({message:error.message});
                }else if(error.code==="RESTAURANT_NOT_FOUND"){
                    return res.status(StatusCodes.NOT_FOUND).json({message:error.message})
                }
            }else{
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR })
            }
        }
    }

    removeRestaurant = async (req: Request,
        res: Response,
        next: NextFunction) => {
        try {
            const restaurantId = req.params.restaurantId;
            if (!restaurantId) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_REQUEST })
            }
             await this._restaurantService.removeById(Number(restaurantId));
            return res.status(StatusCodes.OK).json({
                message: Messages.RESTAURANT_REMOVED,
            });

        } catch (error) {
            if(error instanceof AppError){
                if(error.code ==="RESTAURANT_NOT_FOUND"){
                    return res.status(StatusCodes.NOT_FOUND).json({message:error.message})
                }
            }
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR })
        }
    }
}
