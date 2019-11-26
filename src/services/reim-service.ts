import * as rdao from '../repositories/user-dao';
import { User, Users } from '../models/model-user';

export function getAllUsers(): Promise<Users[]> {

    try {
        return await daoGetAllUsers();
    } catch (e) {
        throw e;
    }
}

export function saveOneUser(u: Users): Promise<Users> {
    return daoSaveOneUser(u);
}

export function updateInfo (id: number, user: Users){
    const reim = udao.daoFindUserById(id);
    for(let i = 0; i < post.userWhoLiked.length; i++) {
        if(post.userWhoLiked[i].id === user.id) {
            post
        }
    }
}