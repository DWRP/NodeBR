const ICrud = require('./intefaces/interfaceCrud')

module.exports = class MongoDB extends ICrud{
    constructor(){
        super()
    }

    create(item){
        console.log('item salvo no mongoDB')
    }
}