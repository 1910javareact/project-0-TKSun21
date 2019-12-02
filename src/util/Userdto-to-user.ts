import { UserDTO } from '../dtos/user-dto'
import { Users } from '../models/model-user'

export function userDTOtoUser(users: UserDTO[]): Users {
    const roles = [];
    for (const user of users) {
        roles.push({
            roleId: user.roleId,
            role: user.role_name
        });
    }
    return new Users(users[0].userId, users[0].username, users[0].password, users[0].firstName, users[0].lastName, users[0].email,roles);
}

export function multipleUserDTOtoUser(uD: UserDTO[]): Users[]{
    let currentUser: UserDTO[] = []
    let result: Users[] = []
    for(let user of uD){
        if(currentUser.length === 0){
            currentUser.push(user)
        }
        else if(currentUser[0].userId === user.userId){
            currentUser.push(user)
        }
        else{
            result.push(userDTOtoUser(currentUser))
            currentUser = []
            currentUser.push(user)
        }
    }
    result.push(userDTOtoUser(currentUser))
    return result
}