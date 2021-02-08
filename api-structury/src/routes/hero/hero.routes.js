const BasicRoute = require('../base/base.routes')
const Joi = require('@hapi/joi')

function failAction(request, headers, erro){
    throw erro;
}

const headers = Joi.object({
    authorization : Joi.string().required()
}).unknown()
class HeroRoutes extends BasicRoute{
    constructor (db){
        super()
        this._db = db
    }
    
    list(){
        return {
            path: '/heroes',
            method: 'GET',
            config:{
                // tags: ['api'],
                // description: 'Obter heróis',
                // notes: 'Carrega os usuários do sistema',
                validate:{
                    failAction,
                    query: Joi.object({
                        name: Joi.string().min(3).max(100),
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10)
                    }),
                    headers
                }
            },
            handler: async (request, headers) => {
                try{
                    const { name, skip, limit } = request.query
                    const query = { name: { $regex: `.*${name}*.`} }

                    return await this._db.read(name?query:{}, skip, limit)
                }
                catch(error){
                    console.error(error)
                    return {erro:"500", mensagem:'Erro no servidor'}
                }
            }
        }
    }
    
    create(){
        return {
            path: '/heroes',
            method: 'POST',
            config:{
                tags: ['api'],
                description: 'Generate token',
                notes: 'Make login with username and password',
                validate:{
                    failAction,
                    payload: Joi.object({
                        name: Joi.string().required().min(3).max(100),
                        power: Joi.string().required().min(2).max(100)
                    }),
                    headers
                }
            },
            handler: async (request, headers) => {
                try{

                    const { name, power } = request.payload

                    await this._db.create({name,power})
                    const data = {
                        message: 'Hero register sucess'
                    }
                    return data
                }
                catch(error){
                    console.error(error)
                    return {erro:"500", mensagem:'Erro no servidor'}
                }
            }
        }
    }
}

module.exports = HeroRoutes