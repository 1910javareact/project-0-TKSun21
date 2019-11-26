import { UserDTO } from '../dtos/user-dto'
import { Users } from '../models/model-user'

export function userDTOtoUser(uD: UserDTO[]): Users {
    const roles = [];
    for (const u of uD) {
        roles.push(u.role_name);
    }
    return new Users(
        uD[0].userId,
        uD[0].username,
        uD[0].password,
        uD[0].firstName,
        uD[0].lastName,
        uD[0].email,
        roles)
}

export function multiUserDTOConvertor(uD: UserDTO[]): Users[] {
    let currentUser: UserDTO[] = [];
    const result: Users[] = [];
    for (const u of uD) {
        if (currentUser.length === 0){
            currentUser.push(u);
        } else if (currentUser[0].userId === u.userId){
            currentUser.push(u);
        } else {
            result.push(userDTOtoUser(currentUser));
            currentUser = [];
            currentUser.push(u);
        }
    }
    result.push(userDTOtoUser(currentUser));
    return result;
}