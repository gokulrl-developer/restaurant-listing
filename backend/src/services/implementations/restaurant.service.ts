import { ErrorCodes } from "../../constants/error-codes.js";
import { Messages } from "../../constants/messages.js";
import { RegexValues } from "../../constants/regex-values.js";
import AppError from "../../error/AppError.js";
import IAddressRepository, { IAddress } from "../../repository/interfaces/address.repository.js";
import IRestaurantRepository from "../../repository/interfaces/restaurant.respository.js";
import { Address, CreateRestaurantDTO, UpdateRestaurantDTO } from "../dtos/restaurant.dto.js";
import IRestaurantService, { CreateResponse, ListResponseItem, UpdateResponse } from "../interfaces/restaurant.service.interface.js";
import { createDTOToRecord, recordToCreateResponse, recordToListResponseItem, recordToUpdateResponse } from "../mappers/restaurant.mapper.js";
import { createDTOToRecord as addressToRecord } from "../mappers/address.mapper.js";

export default class RestaurantService implements IRestaurantService {
    constructor(
        private readonly _restaurantRepository: IRestaurantRepository,
        private readonly _addressRepository: IAddressRepository
    ) { }

    async create(createDTO: CreateRestaurantDTO): Promise<CreateResponse> {
        const { name, address, contact } = createDTO;
        const { street, city, state, country, postalCode } = address;
        const phoneRegex = RegexValues.PHONE_REGEX;
        if (name.length < 2 || name.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.NAME_INVALID_LENGTH)
        }
        if (street.length < 2 || street.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.STREET_INVALID_LENGTH);
        }
        if (city.length < 2 || city.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CITY_INVALID_LENGTH);
        }
        if (state.length < 2 || state.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.STATE_INVALID_LENGTH);
        }
        if (country.length < 2 || country.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.COUNTRY_INVALID_LENGTH);
        }
        if (
            !postalCode ||
            postalCode.length < 2 ||
            postalCode.length > 10 ||
            !/^\d+$/.test(postalCode)
        ) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.POSTAL_CODE_INVALID);
        }
        if (phoneRegex.test(contact) === false) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CONTACTS_INVALID)
        }

        const existingName = await this._restaurantRepository.findByName(name);

        if (existingName) {
            const existingAddress = await this._addressRepository.findById(existingName.addressId);
            if (existingAddress!.street === street && existingAddress!.city === city && existingAddress!.state === state && existingAddress!.country === country && existingAddress!.postalCode === postalCode) {
                throw new AppError(ErrorCodes.RESTAURANT_EXISTS, Messages.RESTAURANT_EXISTS)
            }
        }
        const newAddress = await this._addressRepository.create(addressToRecord(address));
        const newRestaurant = await this._restaurantRepository.create(createDTOToRecord(createDTO, newAddress.id as number));
        return recordToCreateResponse(newRestaurant, newAddress)
    }

    async list(): Promise<ListResponseItem[]> {
        const restaurants = await this._restaurantRepository.findAll();
        return restaurants.map(recordToListResponseItem)
    }

    async update(updateDTO: UpdateRestaurantDTO): Promise<UpdateResponse> {
        let { name, address, contact } = updateDTO;
        if (name) {
            if (name.length < 2 || name.length > 100) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.INVALID_NAME)
            }
        }
        if(address && address.street){
            const street=address.street
        if (street.length < 2 || street.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.STREET_INVALID_LENGTH);
        }
    }
      if(address && address.city){
        const city=address.city;
        if (city.length < 2 || city.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CITY_INVALID_LENGTH);
        }
    }
    if(address && address.state){
        const state=address.state;
        if (state.length < 2 || state.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.STATE_INVALID_LENGTH);
        }
    }
    if(address && address.country){
        const country=address.country;
        if (country.length < 2 || country.length > 100) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.COUNTRY_INVALID_LENGTH);
        }
    }
    if(address && address.postalCode){
        const postalCode=address.postalCode;
        if (
            !postalCode ||
            postalCode.length < 2 ||
            postalCode.length > 10 ||
            !/^\d+$/.test(postalCode)
        ) {
            throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.POSTAL_CODE_INVALID);
        }
    }
        if (contact) {
            const phoneRegex = RegexValues.PHONE_REGEX;
            if (typeof contact !== "string" || phoneRegex.test(contact) === false) {
                throw new AppError(ErrorCodes.VALIDATION_ERROR, Messages.CONTACTS_INVALID)
            }
        }
        const existing = await this._restaurantRepository.findById(updateDTO.restaurantId)

        if (!existing) {
            throw new AppError(ErrorCodes.RESTAURANT_EXISTS, Messages.RESTAURANT_EXISTS)
        }
        const restaurantUpdates: { [key: string]: string } = {};
        if (name) restaurantUpdates.name = name;
        if (contact) restaurantUpdates.contact = contact;

        const updatedCount = await this._restaurantRepository.update(restaurantUpdates,updateDTO.restaurantId);
        const updatedRestaurant = await this._restaurantRepository.findById(updateDTO.restaurantId);
        let updatedAddress:null|IAddress=null;
        if(address){
        const addressUpdates:{[key:string]:string}={};
        if(address.street){
            addressUpdates.street=address.street;
        }
        if(address.city){
            addressUpdates.city=address.city;
        }
        if(address.state){
            addressUpdates.state=address.state;
        }
        if(address.country){
            addressUpdates.country=address.country;
        }
        if(address.postalCode){
            addressUpdates.postalCode=address.postalCode;
        }
        const updatedCount=await this._addressRepository.update(addressUpdates,existing.addressId);
    }
    const newAddress=await this._addressRepository.findById(existing.addressId);
    updatedAddress=newAddress;
        return recordToUpdateResponse(updatedRestaurant!,updatedAddress!)

    }
    async removeById(restaurantId: number): Promise<void> {
        const existing=await this._restaurantRepository.findById(restaurantId);
        if (existing === null) {
            throw new AppError(ErrorCodes.RESTAURANT_NOT_FOUND, Messages.RESTAURANT_NOT_FOUND)
        }
        await this._restaurantRepository.removeById(restaurantId);
        await this._addressRepository.removeById(existing.addressId);
    }
}