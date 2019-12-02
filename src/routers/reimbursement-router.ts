import express from "express"
import * as reimServices from "../services/reim-service"
import { authorization } from "../middleware/auth-middleware"
import { Reimbursement } from "../models/model-reimbursement"

export const reimbursementRouter = express.Router()

reimbursementRouter.get('/status/:statusId', [authorization(['Finance Manager'])], async (req, res) =>{
    
    let statusId = +req.params.statusId
    
    if(isNaN(statusId)){
        res.status(400).send('Invalid ID')
    }
    else{
        try{
            let reim = await reimServices.getReimbursementByStatusId(statusId)
            res.status(200).json(reim)
        }
        catch(e){
            res.status(e.status).send(e.message)
        }
    }
})

reimbursementRouter.get('/author/userId/:userId', [authorization(['Finance Manager', 'Admin', 'User'])], async (req, res)=>{
    let userId = +req.params.userId
    if(isNaN(userId)){
        res.status(400).send('Invalid ID')
    }
    else if(req.session.user.role.role === 'Finance Manager'){
        try{
            let reim = await reimServices.getReimbursementByUserId(userId)
            res.status(200).json(reim)
        }
        catch(e){
            console.log(e);
            
            res.status(e.status).send(e.message)
        }
    }
    else{
        try{
            let reim = await reimServices.getReimbursementByUserId(userId)
            if(req.seession.user.userId === reim[0].author){
                res.status(200).json(reim)
            }
            else{
                res.status(401).send('Unathorized')
            }
        }
        catch(e){
            res.status(e.status).send(e.message)
        }
    }
})

reimbursementRouter.post('',[authorization(['Finance Manager', 'Admin', 'User'])], async (req, res) => {
    
    let {body} = req

    let newReim = new Reimbursement(0,0,0,0,0,'',0,0,0)
        try{    
            for(let key in newReim){

                if(body[key] === undefined){

                    res.status(400).send('All fields are required for a reimbursement')
                    break
                }
                else{
                    newReim[key] = body[key]
                }
            }
            if(await reimServices.saveOneReimbursement(newReim)){
                res.sendStatus(201)
            }
            else{
                res.status(404).send('Reimbursement does not exist')
            }
        }
        catch(e){
            res.status(e.status).send(e.message)
        }
    
})

reimbursementRouter.patch('', authorization(['Finance Manager']), async (req, res)=>{
    try{
        let {body} = req
        
        let newReim = new Reimbursement(0,0,0,0,0,'',0,0,0)

        newReim.reimbursementId = body.reimbursementId

        newReim.status = body.status
        
        let update = await reimServices.updateReimbursement(newReim)

        if(update){
            res.status(200).json(update)
        }
        else{
            res.status(404).send(`Not found`)
        }
    }
    catch(e){
        res.status(e.status).send(e.message)
    }
})

reimbursementRouter.get('', authorization(['Finance Manager']), async (req, res) =>{
    try{
        let allReim = await reimServices.getAllReimbursements()

        res.status(200).json(allReim)
    }
    catch(e){
        res.status(e.status).send(e.message)
    }
})