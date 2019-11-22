import express from 'express'
import bodyparser from 'body-parser'
import { userRouter } from './routers/user-router'
import { loggingMiddleware } from './middleware/logging-middleware'
import { sessionMiddleware } from './middleware/session-middleware'
import { getUserByUsernameAndPassword } from './services/user-service'

const app = express()
app.use(bodyparser.json())
app.use(loggingMiddleware)
app.use(sessionMiddleware)
app.use('/users', userRouter)

app.post('/login', (req,res) =>{
    let {username, password} = req.body
    if(!username || !password) {
        res.status(400).send('Please have a username and password field')
    }
    try{
        let user = getUserByUsernameAndPassword(username, password)
        req.session.user = user
        res.json(user)
    }catch(e){
        res.status(e.status).send(e.message)
    }
})

app.listen(1001, ()=>{
    console.log('app has started');   
})