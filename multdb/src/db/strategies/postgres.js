const ICrud = require('./intefaces/interfaceCrud')

module.exports = class Postgres extends ICrud{
    constructor(){
        super()
    }

    create(item){
        console.log('item salvo no Postgres')
    }
}