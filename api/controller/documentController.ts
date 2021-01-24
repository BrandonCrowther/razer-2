import { Prisma, PrismaClient, Document } from "@prisma/client"
import express from 'express'

function DocumentController(db: PrismaClient){
    const router = express.Router()
    
    router.route('/api/document')
        .get(async function(req, res, next){
            let models = await db.document.findMany()
            res.status(200).json(models)
        })
        .post(async function(req, res, next){
            const modelBody = req.body as Prisma.DocumentCreateInput

            try{
                const created = await db.document.create({data: modelBody})
                res.status(200).json(created)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })

    router.route('/api/document/:id(\\d+)')
        .get(async function(req, res, next){
            const id = parseInt(req.params.id)
            let model = await db.document.findUnique({where: {id: id}})

            if(model){
                model.s3Url = "" //TODO create s3 url
                res.status(200).json(model)
            }
            else
                res.status(404).send("Not found.")
            
        })
        .post(async function(req, res, next){
            const id = parseInt(req.params.id)

            const modelBody = req.body as Document
            modelBody.updatedAt = new Date()

            try{
                const document = await db.document.update({where: {id: id}, data: modelBody})
                res.status(200).json(document)
            }
            catch(e){
                res.status(500).send("Bad Request.")
            }
        })
        .delete(async function(req, res, next){
            const id = parseInt(req.params.id)
            const model = await db.document.delete({where: {id: id}})
            res.status(200).json({status: !!model})
        })

    return router
}

export default DocumentController