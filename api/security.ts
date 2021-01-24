import { User } from "@prisma/client";
import jwt from 'jsonwebtoken';
import config from './config';
import crypto from 'crypto';
import { Request, Response, NextFunction } from "express";

type TokenBody = {
    id: number
    username: string
}


function createTokenFromUser(user: User): string {
    const tokenBody: TokenBody = {
        id: user.id,
        username: user.username,
    }
    return createToken(tokenBody)
}

function createTokenFromJwtPayload(tokenBody: TokenBody){
    return createToken(tokenBody)
}

function createToken(tokenBody: TokenBody){
    const data = {data: tokenBody}
    const options = { expiresIn: config.expiry }
    return jwt.sign(data, config.tokenSecret, options);
}

function validateToken(token: string): TokenBody | false{
    // throws on failure to verify
    try{
        return (jwt.verify(token, config.tokenSecret) as any).data as TokenBody
    }
    catch(e){
        return false
    }
}


function isAdmin(user: User): boolean {
    return user.role == 1
}

function generateSalt(){
    return crypto.randomBytes(16).toString('base64')
}

function checkPassword(password: string, user: User): boolean {
    return generatePasswordFromSalt(password, user.salt) === user.password
}

function generatePasswordFromSalt(password: string, salt: string): string {
    return crypto
            .createHash('RSA-SHA256')
            .update(password)
            .update(salt)
            .digest('hex')
}


async function adminMiddleware(req: Request, res: Response, next: NextFunction){
	if(isAdmin(req.user))
		next()
	else
		res.status(401).send("Not Authorized.")
}


export default {
    createTokenFromUser,
    createTokenFromJwtPayload,
    validateToken,
    isAdmin,
    generateSalt,
    checkPassword,
    generatePasswordFromSalt,
    adminMiddleware
}