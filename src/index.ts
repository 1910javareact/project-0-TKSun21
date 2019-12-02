import express from 'express'
import bodyParser from 'body-parser'
import { sessionMiddleware } from './middleware/session-middleware'
import { getUserByUsernameAndPassword } from './services/user-service'
import { userRouter } from './routers/user-router'
import { reimbursementRouter } from './routers/reimbursement-router';

const app = express()
app.use(bodyParser.json())
app.use(sessionMiddleware)

app.post(`/login`, async (req, res)=>{
    let {username, password} = req.body
    if(!username || !password){
        res.status(400).send(`Invalid Credentials`)
    }
    try{
        let user = await getUserByUsernameAndPassword(username, password)
        req.session.user = user
        res.json(user)
    }
    catch(e){
        console.log(e);
        
        res.status(e.status).send(e.message)
    }
})

app.use(`/users`, userRouter)
app.use(`/reimbursements`, reimbursementRouter)

app.listen(2020, ()=>{
    console.log(`app has started`);
})