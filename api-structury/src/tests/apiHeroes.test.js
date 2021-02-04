const assert = require('assert')
const api = require('./../api')
let app = {}

describe.only('API heroes testing', function () {
    this.beforeAll(async () => {
        app = await api
    })

    it('List /heroes', async ()=>{
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })

    it('List /heroes - Deve retornar somente 10 registros', async ()=>{
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=3'
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.length === 3)
    })
})