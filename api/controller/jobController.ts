import { Prisma, PrismaClient, Job } from "@prisma/client"
import express from 'express'

function JobController(db: PrismaClient){
    const router = express.Router()
    
    router.route('/api/job')
        .get(async function(req, res, next){
            let models = await db.job.findMany()
            res.status(200).json(models)
        })
        .post(async function(req, res, next){
            const clientId = parseInt(req.body.clientId)
            const userId = parseInt(req.body.userId)

            const user = await db.user.findUnique({where: {id: userId}})
            const client = await db.client.findUnique({where: {id: clientId}})

            if(!user || !client){
                res.status(500).send("Failed to find one of user or client for insert.")
            }

            let modelBody = req.body as Prisma.JobCreateInput

            modelBody.Client = {
                connect: {
                    id: clientId
                }
            }
            modelBody.User = {
                connect: {
                    id: userId
                }
            }

            try{
                const created = await db.job.create({data: modelBody})
                res.status(200).json(created)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })

    router.route('/api/job/:id(\\d+)')
        .get(async function(req, res, next){
            const id = parseInt(req.params.id)
            let model = await db.job.findUnique({where: {id: id}})
            
            if(model)
                res.status(200).json(model)
            else
                res.status(404).send("Not found.")
        })
        .post(async function(req, res, next){
            const id = parseInt(req.params.id)
            const modelBody = req.body as Job
            modelBody.updatedAt = new Date()

            try{
                const job = await db.job.update({where: {id: id}, data: modelBody})
                res.status(200).json(job)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })
        .delete(async function(req, res, next){
            const id = parseInt(req.params.id)
            const model = await db.job.delete({where: {id: id}})
            res.status(200).json({status: !!model})
        })

    return router
}

export default JobController