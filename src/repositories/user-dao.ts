import { Users } from "../models/model-user"
import { users } from "../database"

let id = 2

export function daoGetAllUsers():Users[]{
    return users
}

export function daoSaveOneUser(u:Users){
    u.userId = id
    id++
    users.push(u)
    return true
}

export function daoGetUserById(id:number):Users{
    for(let u of users){
        if(u.userId === id){
            return u
        }
    }
    throw {
        status:404,
        message:'This user does not exist'
    }
}

export function daoGetUserByUsernameandPassword
(username:string, password:string){
    for(let u of users){
        if(u.username === username && u.password === password) {
            return u
        }
    }
    throw {
        status: 401,
        message: 'Bad credentials, Not authorized'
    }
}