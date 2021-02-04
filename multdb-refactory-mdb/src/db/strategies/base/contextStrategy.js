const ICrud = require('./../intefaces/interfaceCrud');

module.exports = class ContextStrategy extends ICrud{
    
    constructor(strategy){
        super()
        this._database = strategy
    }

    create(item){
        return this._database.create(item)
    }
    
    read(query,skip,limit){
        return this._database.read(query,skip,limit)
    }
    
    update(id,item){
        return this._database.update(id,item)
    }
    
    delete(id){
        return this._database.delete(id)
    }
    
    async isConnected(){
        return await this._database.isConnected()
    }
}