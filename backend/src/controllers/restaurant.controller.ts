import { Request, Response, NextFunction } from "express";
import { RegexValues } from "../constants/regex-values";
import { Restaurant } from "../models/restaurant.model";
import { Messages } from "../constants/messages";
import { StatusCodes } from "../constants/status-codes";

export const createRestaurant = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const { name, address, contact } = req.body;
        const phoneRegex = RegexValues.PHONE_REGEX;
        if (!name || typeof name !== "string") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.NAME_REQUIRED })
        }
        if (name.length < 2 || name.length > 100) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.NAME_INVALID_LENGTH })
        }
        if (!address || typeof address !== "string") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.ADDRESS_REQUIRED })
        }
        if (address.length < 5 || address.length > 255) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.ADDRESS_INVALID_LENGTH })
        }
        if (!contact) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_REQUIRED })
        }

        if (typeof contact !== "string" || phoneRegex.test(contact) === false) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_INVALID })
        }

        const existing = await Restaurant.findOne({
            where: { name, address }
        });

        if (existing) {
            return res.status(StatusCodes.CONFLICT).json({ message: Messages.RESTAURANT_EXISTS })
        }

        const newRestaurant = await Restaurant.create({ name, address, contact, createdAt: new Date(), updatedAt: new Date() });
        res.status(StatusCodes.CREATED).json({
            restaurant: {
                restaurantId: newRestaurant.id,
                name: newRestaurant.name,
                address: newRestaurant.address,
                contacts: newRestaurant.contact
            }, message: Messages.RESTAURANT_CREATED
        });

    } catch (error) {
        console.log(error)
    }
}