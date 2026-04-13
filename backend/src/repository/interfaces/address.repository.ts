export default interface IAddressRepository {
    findById(addressId: number): Promise<IAddress | null>,
    create(address: IAddress): Promise<IAddress>,
    update(addressUpdates: AddressUpdates, addressId: number): Promise<number>,
    removeById(addressId: number): Promise<number>
}

export interface IAddress {
    id?: number,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    createdAt: Date,
    updatedAt: Date
}
export interface AddressUpdates {
    street?: string,
    city?: string,
    state?: string,
    country?: string,
    postalCode?: string
}