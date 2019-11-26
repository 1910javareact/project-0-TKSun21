import { Users } from "../models/model-user"
import { daoGetAllUsers, daoSaveOneUser,
    daoGetUserById, daoGetUserByUsernameandPassword }
    from "../repositories/user-dao"



export async function getAllUsers():Promise<Users[]>{
    try{
        return await daoGetAllUsers();
    } catch (e) {
        throw e;
    }
}

export function saveOneUser(u:Users): Promise<Users> {
    return daoSaveOneUser(u)
}

export function getUserById(id:number):Promise <Users> {
    console.log("Service: you are searching for user " + id);
    return daoGetUserById(id)
}

export function getUserByUsernameAndPassword
(username:string, password: string): Promise <Users> {
    return daoGetUserByUsernameandPassword(username, password)
}