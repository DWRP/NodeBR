const ICrud = require('../intefaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud{
    constructor(connection, schema){
        super()
        this._connection = connection
        this._schema = schema
    }

    static async connect(){
        const connection = new Sequelize(
            'heroes',
            'dwrpardim',
            'Ncpijkpl-1',
            {
                host:'localhost',
                dialect:'postgres',
                quoteIdentifiers: false,
                logging: false
            }
        )

        return connection
    }

    static async defineModel(connection, schema){
        const model = connection.define(
            schema.name, 
            schema.schema,
            schema.options
        )
        await model.sync()
        return model
    }

    async isConnected(){
        await this._connection.authenticate()
        return true
    }

    async create(item){
        const { dataValues } = await this._schema.create(item)
        return dataValues
    }

    async read(query, skip=0, limit=10){
        const defaltItem = {} = query
        return await this._schema.findAll({
            where: defaltItem,
            raw: true,
            offset: skip,
            limit
        })
    }

    async update(id,data){
        return await this._schema.update(data, { where: { id }})
    }

    async delete(id){

        return await this._schema.destroy({ where:id?{ id }:{} })
    }
}

module.exports = Postgres