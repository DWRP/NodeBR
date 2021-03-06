const ICrud = require('../interfaces/interfaceCrud')
const Mongoose = require('mongoose');
const dontenv = require('dotenv')

dontenv.config()

const STATE = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials'
}

module.exports = class MongoDB extends ICrud{
    constructor(connection, schema){
        super()
        this._connection = connection
        this._schema = schema
    }

    static async connect(){

        await Mongoose.connect(process.env.MONGODB_URI, 
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,   
            }
        )

        const connection = await Mongoose.connection

        return connection
    }

    async isConnected(){
        return STATE[await this._connection.readyState]
    }

    async create(item){
        return await this._schema.create(item)
    }
    async read(query, skip, limit){
        return await this._schema.find(query).skip(skip).limit(limit)
    }
    async update(id,item){
        return await this._schema.updateOne({ _id: id },{ $set: item })
    }
    async delete(id){
        return await this._schema.deleteOne({_id: id})
    }

}