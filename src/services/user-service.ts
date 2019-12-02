import * as user_Dao from "../repositories/user-dao";
import { Users } from "../models/model-user";
import { daoUpdateUser } from "../repositories/user-dao";

export async function getAllUsers():Promise<Users[]>{
    try{
        return await user_Dao.daoGetAllUsers()
    }
    catch(e){
        throw e
    }
}

export async function getUserByUsernameAndPassword(username:string, password:string):Promise<Users>{
    try{
        return await user_Dao.daoGetUserByUsernameAndPassword(username, password)
    }
    catch(e){
        throw e
    }
}

export async function getUserById(id: number):Promise<Users>{
    try{
        return await user_Dao.daoGetUserById(id)
    }
    catch(e){
        throw e
    }
}

export async function updateUser(req: Users){
    try{
        let user = await user_Dao.daoGetUserById(req.userId)
        for(let key in req){
            if(req[key] !== undefined && user.hasOwnProperty(key)){
                user[key] = req[key]
            }
        }
        await daoUpdateUser(user)
        return user
    }catch(e){
        throw e
    }
}