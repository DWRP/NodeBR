const ICrud = require('./intefaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud{
    constructor(){
        super()
        this._driver = null
        this._heroes = null
    }

    async connect(){
        this._driver = new Sequelize(
            'heroes',
            'dwrpardim',
            'Ncpijkpl-1',
            {
                host:'localhost',
                dialect:'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false,
            }
        )

        await this.defineModel()
    }

    async defineModel(){
        this._heroes = this._driver.define('heroes',{
            id:{
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            name:{
                type: Sequelize.STRING,
                required: true
            },
            power:{
                type: Sequelize.STRING,
                required: true
            }
        },{
            tableName: 'TB_HEROES',
            freezeTableName: false,
            timestamps: false 
        })
    
        await this._heroes.sync()
    }

    async isConnected(){
        try{
            await this._driver.authenticate()
            return true
        }
        catch(error){
            console.log('Fail: ', error)
            return false
        }
    }
    async create(item){
        const { dataValues } = await this._heroes.create(item)
        return dataValues
    }

    read(item = {}){
        return this._heroes.findAll({
            where: item,
            raw: true
        })
    }

    async update(id,data){
        return await this._heroes.update(data, { where: { id }})
    }

    async delete(id){

        return await this._heroes.destroy({ where:id?{ id }:{} })
    }
}

module.exports = new Postgres()