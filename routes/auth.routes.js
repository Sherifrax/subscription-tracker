import {Router} from 'express';

const authRouter = Router();

authRouter.post('/sign-up', (req,res) => {
    res.send({
        title: "Sign Up",
        message: "Sign Up route"
    })
})

authRouter.post('/sign-in', (req,res) => {
    res.send({
        title: "Sign In",
        message: "Sign In route"
    })
})

authRouter.post('/sign-out', (req,res) => {
    res.send({
        title: "Sign Out",
        message: "Sign Out route"
    })
})

export default authRouter;