require("dotenv").config();
module.exports={
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
     username: process.env.DATABASE_USERNAME_PROD,
    password: process.env.DATABASE_PASSWORD_PROD,
    database: process.env.DATABASE_NAME_PROD,
    host: process.env.DATABASE_HOST_PROD,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
