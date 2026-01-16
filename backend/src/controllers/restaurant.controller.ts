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
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
    }
}

export const listRestaurants = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const restaurantList = await Restaurant.findAll({
            attributes: [
                ['id', 'restaurantId'],
                'name',
                'address',
                'contact'
            ],
            order: [
                ['name', 'ASC']
            ]
        });
        res.status(StatusCodes.OK).json({
            restaurants: restaurantList
        });

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR })
    }
}

export const updateRestaurant = async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const restaurantId = req.params.restaurantId;
        if (!restaurantId) {
            res.status(StatusCodes.BAD_REQUEST).json({ message:Messages.INVALID_REQUEST})
        }
        if (req.body.name) {
            const name = req.body.name;
            if (typeof name !== "string") {
                return res.status(StatusCodes.BAD_REQUEST).json({message: Messages.INVALID_NAME})
            }
            if (name.length < 2 || name.length > 100) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.NAME_INVALID_LENGTH })
            }
        }

        if (req.body.address) {
            const address = req.body.address;
            if (typeof address !== "string") {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.INVALID_ADDRESS})
            }
            if (address.length < 5 || address.length > 255) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.ADDRESS_INVALID_LENGTH })
            }
        }

        if (req.body.contact) {
            const contact = req.body.contact;
            if (!contact) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_REQUIRED })
            }
            const phoneRegex = RegexValues.PHONE_REGEX;
            if (typeof contact !== "string" || phoneRegex.test(contact) === false) {
                return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.CONTACTS_INVALID })
            }
        }
        const existing = await Restaurant.findOne({
            where: { id: restaurantId }
        });

        if (!existing) {
            return res.status(StatusCodes.CONFLICT).json({ message: Messages.RESTAURANT_EXISTS})
        }
        const updates: { [key: string]: string } = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.address) updates.address = req.body.address;
        if (req.body.contact) updates.contact = req.body.contact;

        await Restaurant.update(updates, {
            where: { id: restaurantId },
        });

        const updatedRestaurant = await Restaurant.findOne({
            where: { id: restaurantId },
            attributes: ["id", "name", "address", "contact"],
        });

        return res.status(StatusCodes.OK).json({
            message: Messages.RESTAURANT_UPDATED,
            restaurant: updatedRestaurant,
        });

    } catch (error) {
        console.log("error updating restaurant", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR })
    }
}