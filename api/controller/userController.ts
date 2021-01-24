import { Prisma, PrismaClient, User } from "@prisma/client"
import express from 'express'
import security from "../security"

const safeUserSelect: Prisma.UserSelect = {
    id: true,
    username: true,
    email: true,
    password: false,
    salt: false,
    role: true,
    createdAt: true,
    updatedAt: true,
    Job: false,
}

function UserController(db: PrismaClient){
    const router = express.Router()
    
    router.route('/api/user')
        .get(async function(req, res, next){
            let models = await db.user.findMany({select: safeUserSelect})
            res.status(200).json(models)
        })
        .post(async function(req, res, next){
            if(req.body.salt)
                delete req.body.salt
            const modelBody = req.body as User

            if(req.body.password){
                modelBody.salt = security.generateSalt()
                modelBody.password = security.generatePasswordFromSalt(modelBody.password, modelBody.salt)
            }

            try{
                const created = await db.user.create({select: safeUserSelect, data: modelBody})
                res.status(200).json(created)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })

    router.route('/api/user/:id(\\d+)')
        .get(async function(req, res, next){
            const id = parseInt(req.params.id)
            let model = await db.user.findUnique({select: safeUserSelect, where: {id: id}})
            
            if(model)
                res.status(200).json(model)
            else
                res.status(404).send("Not found.")
        })
        .post(async function(req, res, next){
            const id = parseInt(req.params.id)
            if(req.body.salt)
                delete req.body.salt
            const modelBody = req.body as User
            modelBody.updatedAt = new Date()

            if(req.body.password){
                modelBody.salt = security.generateSalt()
                modelBody.password = security.generatePasswordFromSalt(modelBody.password, modelBody.salt)
            }

            try{
                const user = await db.user.update({select: safeUserSelect, where: {id: id}, data: modelBody})
                res.status(200).json(user)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })
        .delete(async function(req, res, next){
            const id = parseInt(req.params.id)
            if(id != 1){
                const model = await db.user.delete({where: {id: id}})
                res.status(200).json({status: !!model})
            }
            else{
                res.status(500).send("Cannot delete brandon!")
            }
        })

    router.route('/api/user/:id(\\d+)/job')
        .get(async function(req, res, next){
            let models = await db.job.findMany({where: {userId: req.user.id}})
            res.status(200).json(models)
        })

    return router
}

export default UserController