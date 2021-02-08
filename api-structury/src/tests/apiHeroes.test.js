const assert = require('assert')
const api = require('./../api')
let app = {}

const Dotenv = require('dotenv')
Dotenv.config()

const TOKEN = process.env.TOKEN

const headers = {
    Authorization: TOKEN
}

const MOCK_DEFAULT_HERO = {
    name: `Chapolim`,
    power: 'All'
}

describe('API heroes testing', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('List /heroes', async ()=>{
        const result = await app.inject({
            method: 'GET',
            url: '/heroes',
            headers
            
        })
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })
    
    it('List /heroes - Deve retornar somente 10 registros', async ()=>{
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=3',
            headers
        })
        
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.length === 3)
    })
    
    it('Create /heroes - Deve criar herói', async ()=>{
        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            headers,
            payload: JSON.stringify(MOCK_DEFAULT_HERO)
        })
        
        // console.log(result.payload)

        const statusCode = result.statusCode
        const { message } = JSON.parse(result.payload)
        
        assert.ok(statusCode === 200)
        assert.deepStrictEqual(message, 'Hero register sucess')
    })
})