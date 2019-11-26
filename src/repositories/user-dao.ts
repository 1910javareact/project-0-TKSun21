import { Users } from "../models/model-user";
import { PoolClient } from 'pg';
import { connectionPool } from ".";
import { multiUserDTOConvertor, userDTOtoUser } from '../util/Userdto-to-user';



export async function daoGetAllUsers(): Promise<Users[]>{
    let client: PoolClient;
    
    try{
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM user_book.user natural join user_book.user_roles natural join user_book.roles');
        return multiUserDTOConvertor(result.rows);
    } catch (e){
        console.log(e);
        throw {
            status: 500,
            message: 'Internal Server Erroe'
        };
    } finally {
        client && client.release();
    }
}

export async function daoSaveOneUser(u:Users): Promise<Users>{

    let client: PoolClient;
    client = await connectionPool.connect();

    try{
        await client.query('BEGIN');

        const result = await client.query('INSERT INTO user_book.user (username, "password", "firstName", "lastName", "email") values ($1,$2,$3,$4,$5) RETURNING user_id',
        [u.username, u.password, u.firstName, u.lastName, u.email]);
        for(const role of u.role){
            let roleId = 0;
            switch (role) {
                case 'Admin':
                    roleId = 1;
                    break;
                case 'Finance-Manager':
                    roleId = 2;
                    break;
                default:
                    roleId = 3;
                    break;
            }
            await client.query('INSERT INTO user_book.user_roles VALUES($1,$2)',
            [result.rows[0].user_id, roleId ]);
        }
        u.userId = result.rows[0].user_id;
        await client.query('COMMIT');
        return u;
    } catch (e) {
        await client.query('ROLLBACK');
        throw {
            status: 500,
            message: 'Internal Server Error'
        };
    } finally {
        client && client.release();
    }
}


export async function daoGetUserById(userId: number): Promise<Users> {
    let client: PoolClient;
    try{
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM user_book.user natural join user_book.user_roles natural join user_book.roles where user_id = $1', [userId]);
        if(result.rowCount > 0){
            return userDTOtoUser(result.rows);
        } else {
            throw 'This User is Not Found'
        }
    } catch (e) {
        if (e === 'This User is Not Found'){
            throw {
                status: 404,
                message: 'this user does not exist'
            };
        } else {
            throw {
                status: 500,
                message: 'Internal Server Error'
            };
        }
    }
}

export async function daoGetUserByUsernameandPassword(username:string, password:string): Promise<Users>{

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        const result = await client.query('SELECT * FROM user_book.user natural join user_book.user_roles natural join user_book.roles WHERE username = $1 and password = $2',
        [username, password]);
        if (result.rowCount === 0){
            throw 'bad credentials';
        } else {
            return userDTOtoUser(result.rows)
        }
    } catch (e) {
        console.log(e);
        if (e === 'bad credentials'){
            throw {
                status: 401,
                message: 'Bad credentials'
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