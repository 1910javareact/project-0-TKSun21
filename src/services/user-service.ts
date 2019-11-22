import { Users } from "../models/model-user"
import { daoGetAllUsers, daoSaveOneUser,
    daoGetUserById, daoGetUserByUsernameandPassword }
    from "../repositories/user-dao"



export function getAllUsers():Users[]{
    return daoGetAllUsers()
}

export function saveOneUser(u:Users) {
    return daoSaveOneUser(u)
}

export function getUserById(id:number):Users{
    console.log("Service: you are searching for user " + id);
    return daoGetUserById(id)
}

export function getUserByUsernameAndPassword
(username:string, password){
    return daoGetUserByUsernameandPassword(username, password)
}