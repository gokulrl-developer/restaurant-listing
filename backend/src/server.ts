import {config} from "dotenv"
config()
import app from "./app";


const startServer= async ()=>{
  try{

    const PORT=process.env.PORT;

    app.listen(PORT,()=>{
        console.log(`Server starting at port ${PORT}`)
    })
  }catch(error){
     throw new Error("Error starting server")
     process.exit(1);
  }
}

startServer()