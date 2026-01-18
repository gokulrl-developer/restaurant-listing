import { Sequelize } from "sequelize";
import type Restaurant from "../models/restaurant.model.js";

export interface Db {
  Restaurant: typeof Restaurant;

  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}