import dotenv from "dotenv";
dotenv.config();
module.exports ={
  development: {
    username: process.env.DATABASE_USERNAME_DEV,
    password: process.env.DATABASE_PASSWORD_DEV,
    database: process.env.DATABASE_NAME_DEV,
    host: process.env.DATABASE_HOST_DEV,
    dialect: "postgres"
  },
  test: {
     username: process.env.DATABASE_USERNAME_DEV,
    password: process.env.DATABASE_PASSWORD_DEV,
    database: process.env.DATABASE_NAME_DEV,
    host: process.env.DATABASE_HOST_DEV,
    dialect: "postgres"
  },
  production: {
     username: process.env.DATABASE_USERNAME_DEV,
    password: process.env.DATABASE_PASSWORD_DEV,
    database: process.env.DATABASE_NAME_DEV,
    host: process.env.DATABASE_HOST_DEV,
    dialect: "postgres"
  }
}
