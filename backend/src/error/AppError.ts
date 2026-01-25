import { ErrorCodeTypes } from "../constants/error-codes.js";

export default class AppError extends Error{
    public code:ErrorCodeTypes;
    constructor(code:ErrorCodeTypes,message:string){
        super(message);
        this.code=code;        
    }
}