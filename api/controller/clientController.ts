import { Prisma, PrismaClient, Client } from "@prisma/client"
import express from 'express'

function ClientController(db: PrismaClient){
    const router = express.Router()
    
    router.route('/api/client')
        .get(async function(req, res, next){
            let models = await db.client.findMany()
            res.status(200).json(models)
        })
        .post(async function(req, res, next){
            const modelBody = req.body as Prisma.ClientCreateInput

            try{
                const created = await db.client.create({data: modelBody})
                res.status(200).json(created)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })

    router.route('/api/client/:id(\\d+)')
        .get(async function(req, res, next){
            const id = parseInt(req.params.id)
            let model = await db.client.findUnique({where: {id: id}})
            
            if(model)
                res.status(200).json(model)
            else
                res.status(404).send("Not found.")
        })
        .post(async function(req, res, next){
            const id = parseInt(req.params.id)

            const modelBody = req.body as Client
            modelBody.updatedAt = new Date()

            try{
                const client = await db.client.update({where: {id: id}, data: modelBody})
                res.status(200).json(client)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })
        .delete(async function(req, res, next){
            const id = parseInt(req.params.id)
            const model = await db.client.delete({where: {id: id}})
            res.status(200).json({status: !!model})
        })

    return router
}

export default ClientController