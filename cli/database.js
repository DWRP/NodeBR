const {
    readFile,
    writeFile
} = require('fs')

const {
    promisify
} = require('util')

// const {} = require('')


const rfAsync = promisify(readFile)
const wfAsync = promisify(writeFile)

class Database{
    constructor(){
        this.FILE_NAME = 'heroes.json'
    }

    async readDataFile(){
        const file = await rfAsync(this.FILE_NAME,'utf8')

        return JSON.parse(file.toString())
    }

    async writeDataFile(data){
        await wfAsync(this.FILE_NAME,JSON.stringify(data))
        return true
    }

    async register(hero){
        const data = await this.readDataFile()
        const id = hero.id? hero.id:Date.now()

        const heroWithID = {
            id,
            ...hero
        }

        const finalData = [
            ...data,
            heroWithID
        ]

        const result = await this.writeDataFile(finalData)

        return result
    }
    
    async remove(id){
        if(!id){
            return await this.writeDataFile([])
        }
        const data = await this.readDataFile()
        const index = data.findIndex(item=>item.id === parseInt(id))
        if(index === -1) {
            throw Error('User not find')
        }

        data.splice(index, 1)
        return await this.writeDataFile(data)
    }

    async update(id,dataUpdate){
        const data = await this.readDataFile()
        const index = data.findIndex(item=>item.id === parseInt(id))
        if(index === -1) {
            throw Error('Hero not exist')
        }

        const current = data[index]
        const updatedObject = {
            ...current,
            ...dataUpdate
        }

        data.splice(index, 1)

        return await this.writeDataFile([
            ...data,
            updatedObject
        ])

    }

    async listIn(id){
        const data = await this.readDataFile()
        const dataFilter = data.filter(item=>id?(item.id === id):true)
        return dataFilter
    }

}

module.exports = new Database()