const BasicRoute = require('../base/base.routes')
const Joi = require('joi')

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
                validate:{
                    failAction:(request, headers, erro)=>{
                        throw erro;
                    },
                    query: {
                        name: Joi.string().min(3).max(100),
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10)
                    }
                }
            },
            handler: (request, headers) => {
                try{
                    const { name, skip, limit } = request.query
                    const query = { name: { $regex: `.*${name}*.`} }

                    return this._db.read(name?query:{}, skip, limit)
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