import dotenv from "dotenv"
dotenv.config();
import fs from "fs"
import path from "path"
import { Sequelize, DataTypes, ModelStatic, Model } from "sequelize";
const env = process.env.NODE_ENV || 'development';
import { fileURLToPath, pathToFileURL } from "node:url";
import { Db } from "../types/db.types.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
type SequelizeModel = ModelStatic<Model>;
const db: Record<string, SequelizeModel> & {
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
} = {};


let sequelize: Sequelize;


if (env === "production") {
  sequelize = new Sequelize(process.env.DATABASE_NAME_PROD!,
    process.env.DATABASE_USERNAME_PROD!,
    process.env.DATABASE_PASSWORD_PROD!, {
    host: process.env.DATABASE_HOST_PROD!,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_NAME_DEV!,
    process.env.DATABASE_USERNAME_DEV!,
    process.env.DATABASE_PASSWORD_DEV!, {
    host: process.env.DATABASE_HOST_DEV!,
    dialect: "postgres"
  });
}


const files = fs.readdirSync(__dirname);
for (const file of files) {
  if (
    file.startsWith(".") ||
    file === path.basename(__filename) ||
    (!file.endsWith(".ts") && !file.endsWith(".js")) ||
    file.endsWith(".test.ts") ||
    file.endsWith(".test.js")
  ) {
    continue;
  }
  const modelUrl = pathToFileURL(path.resolve(__dirname, file)).href;
  const modelModule = await import(modelUrl);
  const modelClass: SequelizeModel =
    modelModule.default || Object.values(modelModule)[0];

  if (!modelClass) continue;
  if ("initModel" in modelClass && typeof modelClass.initModel === "function") {
    modelClass.initModel(sequelize);

  }

  db[modelClass.name] = modelClass;
}

Object.values(db).forEach((model) => {
  if ("associate" in model && typeof model.associate === "function") {
    model.associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db as unknown as Db;
