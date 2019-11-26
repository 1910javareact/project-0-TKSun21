import express from 'express';
import * as pservice from '../services/post-service';
import { Reimbursement } from '../models/model-reimbursement';
import { authorization } from '../middleware/auth-middleware';
import { Users } from '../models/model-user';

export const reimRouter = express.Router()

reimRouter.get('/reimbursements/status/:statusId', [authorization['Finance-manager']], async (req,res) => {
    const id = +req.params.id;
    if(isNaN(id)){
        res.sendStatus(400)
    } else {
        try{
            const reimId = await getReimById(id)
            res.json(reimId)
        } catch(e){
            res.status(e.status).send(e.message)
        }
    }
}

reimRouter.get('/reimbursements/author/userId/:userId', [authorization(['Users','Finance-manager'])], async (req,res) => {
    const id = +req.params.id;
    if(isNaN(id)){res.sendStatus(400)
    } else {
        try{
            const reimUser =  await getReimByUser(id)
            res.json(reimUser)
        } catch (e){
            res.status(e.status).send(e.message)
        }
    }
})

reimRouter.post('/reimbursements', [authorization(['Users']),
    async (req, res) => {
        const {body} = req
        const newU = new Users(0,'','','','','',[])
        for (const key in newU){
            if(body[key] === undefined){
                res.status(400).send('Please include all fields')
                break;
            } else {
                newU[key] = body[key]
            }
        }
        try{
            const user = await saveOneReim(newU)
            res.status(201).json(user)
        } catch (e) {
            res.status(e.status).send(e.message);
        }
    }
])

reimRouter.patch('/reimbursements', [authorization(['Finance-manager']), (req,res) => {
    const id = +req.params.id;
    const reim = req.session.user;
    try {
        const post = pservice.likePost(id, reim);
        res.json(post);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}]))