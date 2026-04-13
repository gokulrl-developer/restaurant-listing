import { Sequelize } from "sequelize";
import type Restaurant from "../models/restaurant.model.js";
import Address from "../models/address.model.js";

export interface Db {
  Restaurant: typeof Restaurant;
  Address:typeof Address;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}