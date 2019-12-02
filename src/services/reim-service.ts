import * as daoReim from "../repositories/reimbursement-dao"
import { Reimbursement } from "../models/model-reimbursement";

export async function getAllReimbursements():Promise<Reimbursement[]>{
    try{
        return await daoReim.daoGetAllReimbursements()
    }
    catch(e){
        throw e
    }
}

export async function saveOneReimbursement(reimbursement:Reimbursement):Promise<Reimbursement>{
    try{
        return await daoReim.daoSaveOneReimbursement(reimbursement)
    }
    catch(e){
        throw e
    }
}

export async function getReimbursementByStatusId(id:number):Promise<Reimbursement[]>{
    try{
        return await daoReim.daoReimbursementByStatusId(id)
    }
    catch(e){
        throw e
    }
}

export async function getReimbursementByUserId(id:number):Promise<Reimbursement[]>{
    try{
        return await daoReim.daoGetReimbursementByUserId(id)
    }
    catch(e){
        throw e
    }
}

export async function updateReimbursement(reimbursement:Reimbursement):Promise<Reimbursement>{
    try{
        return await daoReim.daoUpdateReimbursement(reimbursement)
     }
    catch(e){
        throw e
    }    
}