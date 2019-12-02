import { PoolClient } from 'pg';

import { Users } from '../models/model-user';
import { connectionPool } from '.';
import { userDTOtoUser, multipleUserDTOtoUser } from '../util/Userdto-to-user';



export async function daoGetAllUsers():Promise<Users[]>{
let client : PoolClient;
try{

    client = await connectionPool.connect();
    const result = await client.query('SELECT * FROM project0.users NATURAL JOIN project0.users_roles NATURAL JOIN project0.roles ORDER BY user_id')
return multipleUserDTOtoUser(result.rows)
}catch(e) {
    console.log(e);
    throw {
        status:500,
        message:'Internal Server Error!'
    };
}finally {
    client && client.release();
}

}
export async function daoGetUserById(id:number):Promise<Users>{
    let client:PoolClient;
    try{
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM project0.users NATURAL JOIN project0.users_roles NATURAL JOIN project0.roles WHERE user_id = $1',
        [id]);
        if (result.rowCount > 0){
            return userDTOtoUser(result.rows);
        } else {
            throw 'No such User';
        }
    
    } catch(e){
        if (e === 'No such User'){
            throw {
                status : 404,
                message : 'This User Does not Exist'
            }
        } else {
            throw{
                status : 500,
                message: 'Internal Server Error'
            }
        }
    }
}
export async function daoGetUserByUsernameAndPassword(username: string, password: string): Promise<Users> {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();

        const result = await client.query('SELECT * FROM project0.users NATURAL JOIN project0.users_roles NATURAL JOIN project0.roles WHERE username = $1 and password = $2',
            [username, password]);
        if (result.rowCount === 0) {
            throw 'Invalid Credentials';
        } else {
            return userDTOtoUser(result.rows);
        }
    } catch (e) {
        console.log(e);

        if (e === 'Invalid Credentials') {
            throw{
                status: 401,
                message: 'Invalid Credentials'
            };
        } else {
            throw {
                status: 500,
                message: 'Internal Server Error'
            };
        }
    } finally {
        client && client.release();
    }
}
export async function daoUpdateUser(u: Users) {
    let client: PoolClient;
    try {
        client = await connectionPool.connect();
        client.query('BEGIN');
        await client.query('update project0.users set username = $1, password = $2, first_name = $3, last_name = $4, email = $5 where user_id = $6',
            [u.username, u.password, u.firstName, u.lastName, u.email, u.userId]);
        await client.query('delete from project0.users_roles where user_id = $1',
            [u.userId]);
        for ( const role of u.role) {
            await client.query('insert into project0.users_roles values ($1,$2)',
            [u.userId, role.roleId]);
        }
        client.query('COMMIT');
    } catch (e) {
        client.query('ROLLBACK');
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client.release();
    }
}