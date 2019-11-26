import express from 'express'
import { Users } from '../models/model-user'
import { getAllUsers, saveOneUser, getUserById } from '../services/user-service'
import { authorization } from '../middleware/auth-middleware'

export const userRouter = express.Router()

async function controllerGetUsers(req, res){
    try{
        const users = await getAllUsers();
        res.json(users);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}

userRouter.get('', [authorization(['Admin']), controllerGetUsers])

userRouter.get('/users/:id', async (req,res)=> {
    const id = +req.params.id;
    if(isNaN(id)){
        res.sendStatus(400)
    } else {
        try{
            const user = await getUserById(id)
            res.json(user)
        } catch(e){
            res.status(e.status).send(e.message)
        }
    }
})

userRouter.post('', [authorization(['Admin', 'Financial-Manager']),
    async (req,res)=>{
        const {body} = req
        const newU = new Users(0,'','','','','',[])
        for (const key in newU){
            if(body[key] === undefined){
                res.status(400).send('Please include all user fields')
                break;
            } else {
                newU[key] = body[key]
            }
        }
        try{
            const user = await saveOneUser(newU)
            res.status(201).json(user)
        } catch (e){
            res.status(e.status).send(e.message);
        }
    }
]);