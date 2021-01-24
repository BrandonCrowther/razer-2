import express from 'express'
import security from './security'
import cookieParser from 'cookie-parser'
import { PrismaClient, User } from '@prisma/client'
import UserController from './controller/userController'
import ClientController from './controller/clientController'
import JobController from './controller/jobController'
import config from './config'

declare global {
	namespace Express {
		interface Request {
			user: User
		}
	}
}

const db = new PrismaClient()

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy

app.use(function(req, res, next){
	console.log(new Date(), req.method, req.originalUrl)
	console.log(new Date(), req.body)
	next()
})

app.post('/api/login', async function(req, res){
	const userPayload = req.body as User
	const user = await db.user.findUnique({where: {username: userPayload.username}})
	if(user){
		if(security.checkPassword(userPayload.password, user)){
			const token = security.createTokenFromUser(user)
			res.status(200)
				.cookie('token', token)
				.json({token: token})
		}
		else res.status(401).send("Invalid authentication concept.")
	}
	else res.status(401).send("Invalid authentication concept.")
})

// Validate user is logged in and sets user model for request
app.use(async function(req, res, next){
	if(req.cookies.token){
		const decoded = security.validateToken(req.cookies.token)
		if(decoded){
			const user = await db.user.findUnique({where: {id: decoded.id}})
			if(user)
				req.user = user
			else
				res.status(500).send("Cannot find user for authentication concept.")

			res.cookie('token', security.createTokenFromJwtPayload(decoded))

			next()
		}
		else res.status(401).send("Invalid authentication concept.");
	}
	else res.status(401).send("Missing authentication concept.");
})

app.use(UserController(db))

app.use(ClientController(db))

app.use(JobController(db))


// // Api routes
// app.route('/api/jobs')
// 	.get(userController.api.jobs)
// app.route('/api/todaysJobs')
// 	.get(userController.api.todays_jobs)
// app.route('/api/job/:id/start')
// 	.post(jobController.api.start)
// app.route('/api/job/:id/stop')
// 	.post(jobController.api.stop)

export default app