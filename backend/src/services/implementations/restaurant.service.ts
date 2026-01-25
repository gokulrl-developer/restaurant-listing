import { ErrorCodes } from "../../constants/error-codes.js";
import { Messages } from "../../constants/messages.js";
import { RegexValues } from "../../constants/regex-values.js";
import AppError from "../../error/AppError.js";
import IRestaurantRepository from "../../repository/interfaces/restaurant.respository.js";
import { CreateRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dto.js";
import IRestaurantService, { CreateResponse, ListResponseItem, UpdateResponse } from "../interfaces/restaurant.service.interface.js";
import { createDTOToRecord, recordToCreateResponse, recordToListResponseItem, recordToUpdateResponse } from "../mappers/restaurant.mapper.js";

export default class RestaurantService implements IRestaurantService {
    constructor(
        private readonly _restaurantRepository: IRestaurantRepository
    ) { }

    async create(createDTO: CreateRestaurantDTO): Promise<CreateResponse> {
        const { name, address, contact } = createDTO;
        const phoneRegex = RegexValues.PHONE_REGEX;
        if (name.length < 2 || name.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.NAME_INVALID_LENGTH)
        }
        if (address.length < 5 || address.length > 255) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.ADDRESS_INVALID_LENGTH)
        }
        if (phoneRegex.test(contact) === false) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CONTACTS_INVALID)
        }

        const existing = await this._restaurantRepository.findByNameAndAddress(name, address);

        if (existing) {
            throw new AppError(ErrorCodes.RESTAURANT_EXISTS, Messages.RESTAURANT_EXISTS)
        }

        const newRestaurant = await this._restaurantRepository.create(createDTOToRecord(createDTO));
        return recordToCreateResponse(newRestaurant)
    }

    async list(): Promise<ListResponseItem[]> {
        const restaurants = await this._restaurantRepository.findAll();
        return restaurants.map(recordToListResponseItem)
    }

    async update(updateDTO: UpdateRestaurantDTO): Promise<UpdateResponse> {
        let { name, address, contact } = updateDTO
        if (name) {
            if (name.length < 2 || name.length > 100) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.INVALID_NAME)
            }
        }
        if (address) {
            if (address.length < 5 || address.length > 255) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.ADDRESS_INVALID_LENGTH)
            }
        }
        if (contact) {
            const phoneRegex = RegexValues.PHONE_REGEX;
            if (typeof contact !== "string" || phoneRegex.test(contact) === false) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CONTACTS_INVALID)
            }
        }
        const existing = this._restaurantRepository.findById(updateDTO.restaurantId)

        if (!existing) {
            throw new AppError(ErrorCodes.RESTAURANT_EXISTS, Messages.RESTAURANT_EXISTS)
        }
        const updates: { [key: string]: string } = {};
        if (name) updates.name = name;
        if (address) updates.address = address;
        if (contact) updates.contact = contact;

        const updatedRestaurant = await this._restaurantRepository.findById(updateDTO.restaurantId);
        return recordToUpdateResponse(updatedRestaurant!)

    }
    async removeById(restaurantId: number): Promise<void> {
        const deletedCount = await this._restaurantRepository.removeById(restaurantId);
        if (deletedCount === 0) {
            throw new AppError(ErrorCodes.RESTAURANT_NOT_FOUND, Messages.RESTAURANT_NOT_FOUND)
        }
    }
}