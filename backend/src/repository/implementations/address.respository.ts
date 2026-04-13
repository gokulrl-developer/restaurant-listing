import db from "../../models/index.js";
import IAddressRepository, { AddressUpdates, IAddress } from "../interfaces/address.repository.js";

export default class AddressRepository implements IAddressRepository{
    async findById(addressId:number):Promise<IAddress|null>{
        return await db.Address.findOne({
            where:{
              id:addressId
            }
        })
     }

     async create(address:IAddress):Promise<IAddress>{
         const {street,city,state,country,postalCode}=address;
       return await db.Address.create({street,city,state,country,postalCode, createdAt: new Date(), updatedAt: new Date() })
      }
     
      async update(addressUpdates: AddressUpdates, addressId: number): Promise<number> {
              const [updatedCount] = await db.Address.update(addressUpdates, {
                  where: { id: addressId },
              });
              return updatedCount;
          }

    async removeById(addressId: number): Promise<number> {
           return await db.Address.destroy({
               where: { id: addressId },
           });
       }
}