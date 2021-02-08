const BasicRoute = require('../base/base.routes')
const Joi = require('@hapi/joi')
const Jwt = require('jsonwebtoken')
const Boom = require('boom')

const PasswordHelper = require('../../helpers/passwordHelper')

function failAction(request, headers, erro){
    throw erro;
}

const USER = {
    username: 'testeuser',
    password: 'testepassword'
}

class AuthRoutes extends BasicRoute{
    constructor (secret, db){
        super()
        this._secret = secret
        this._db = db
    }

    login(){
        return {
            path: '/login',
            method: 'POST',
            config:{
                auth: false,
                tags:['auth'],
                description: 'Generate token',
                notes: 'Make login with username and password',
                validate:{
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request, headers) => {
                try{

                    const { username, password } = request.payload

                    const [user] = await this._db.read({
                        username: username.toLowerCase()
                    })

                    if(!user) { 
                        return Boom.unauthorized('User Not exist')
                    }

                    const math = await PasswordHelper.comparePassword(password, user.password)

                    if(!math) { 
                        return Boom.unauthorized('User or pass incorrect')
                    }

                    const token = Jwt.sign({
                        username,
                        id: user.id
                    }, this._secret)

                    return {
                        token
                    }
                }
                catch(error){
                    console.error(error)
                    return {erro:"500", mensagem:'Erro no servidor'}
                }
            }
        }
    }

    register(){
        return {
            path: '/register',
            method: 'POST',
            config:{
                auth: false,
                tags:['auth'],
                description: 'Generate token',
                notes: 'Make login with username and password',
                validate:{
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },
            handler: async (request, headers) => {
                try{

                    const { username, password } = request.payload

                    const [user] = await this._db.read({
                        username: username.toLowerCase()
                    })

                    if(!user) return Boom.unauthorized('User Not exist')
                    
                    const math = PasswordHelper.comparePassword(password, user.password)

                    if(!math) return Boom.unauthorized('User or pass incorrect')

                    const token = Jwt.sign({
                        username,
                        id: user.id
                    }, this._secret)

                    return {
                        token
                    }
                }
                catch(error){
                    console.error(error)
                    return {erro:"500", mensagem:'Erro no servidor'}
                }
            }
        }
    }
}

module.exports = AuthRoutes