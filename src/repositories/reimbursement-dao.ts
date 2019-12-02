import { Reimbursement } from "../models/model-reimbursement";
import { PoolClient } from "pg";
import { connectionPool, schema } from ".";
import { multiReimbursementDTOtoReimbursement, reimbursementDTOtoReimbursement } from "../util/Reimdto-to-reim";


export async function daoGetAllReimbursements():Promise<Reimbursement[]>{
    let client: PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query(`select * from ${schema}.reimbursement`)

        if(result.rowCount === 0){
            throw 'No Reimbursements Exits'
        }
        else{
            return multiReimbursementDTOtoReimbursement(result.rows)
        }
    }
    catch(e){
        if(e == 'No Reimbursements Exits'){
            throw{
                status: 404,
                message: 'No Reimbursements Exits'
            }
        }
        else{
            throw{
                status: 500,
                message: 'Internal Server Error'
            }
        }
    }
    finally{
        client && client.release()
    }
}

export async function daoSaveOneReimbursement(r:Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query(`BEGIN`)

        let holder = await client.query('INSERT INTO project0 (author, amount, date_submitted, date_resolved, description, resolver, status_id, type_id) values ($1,$2,now(),$3,$4,null,1,$5)',
        [r.author, r.amount, '0001/01/01', r.description, r.type])

        let result = await client.query('SELECT * FROM project0 WHERE reimbursement_id = $1',
        [holder.rows[0].reimbursement_id])
        await client.query('COMMIT')

        return reimbursementDTOtoReimbursement(result.rows)
    }
    catch(e){
        client.query('ROLLBACK')
        throw{
            status: 500,
            message: 'Internal Server Error'
        }
    }
    finally{
        client && client.release()
    }
}

export async function daoReimbursementByStatusId(statusId:number):Promise<Reimbursement[]>{
    let client: PoolClient

    try{
        client = await connectionPool.connect()
        let result = await client.query(`SELECT * FROM ${schema}.reimbursement WHERE status = $1 ORDER BY date_submitted DESC`,
        [statusId])
        if(result.rowCount === 0){
            throw `Reimbursement does not exist`
        }
        else{
            return multiReimbursementDTOtoReimbursement(result.rows)
        }
    }
    catch(e){
        if(e === `Reimbursement does not exist`){
            throw{
                status: 404,
                message: `Reimbursement does not exist`
            }
        }
        else{
            throw{
                status: 500,
                message: `Internal Server Error`
            }
        }
    }
    finally{
        client && client.release()
    }
}

export async function daoGetReimbursementByUserId(userId:number):Promise<Reimbursement[]>{
    let client:PoolClient
    
    try{
        client = await connectionPool.connect()
        let result = await client.query(`SELECT * FROM ${schema}.reimbursement WHERE author = $1 ORDER BY date_submitted DESC`,
        [userId])
        if(result.rowCount === 0){
            throw `No Reimbursement Found`
        }
        else{
            return multiReimbursementDTOtoReimbursement(result.rows)
        }
    }
    catch(e){
        if(e === `No Reimbursement Found`){
            throw{
                status: 404,
                message: `No Reimbursement Found`
            }
        }
        else{
            throw{
                status: 500,
                message: `Internal Server Error`
            }
        }
    }
    finally{
        client && client.release()
    }
}

export async function daoUpdateReimbursement(update: Reimbursement):Promise<Reimbursement>{
    let client:PoolClient
    
    try{
        await client.query('BEGIN')

        await client.query('UPDATE project0.reimbursement SET status = $1, description = $3 WHERE reimbursement_id = $2',
        [update.status, update.reimbursementId])
        
        let result = await client.query('SELECT * FROM project0.reimbursement WHERE reimbursement_id = $1',
        [update.reimbursementId])
        
        await client.query('COMMIT')
        return reimbursementDTOtoReimbursement(result.rows)
    }
    catch(e){
        await client.query('ROLLBACK')

        throw{
            status: 500,
            message: 'Internal Server Error'
        }
    }
    finally{
        client && client.release()
    }
}