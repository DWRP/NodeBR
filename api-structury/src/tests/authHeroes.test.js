const assert = require('assert')
const api = require('./../api')

const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/Postgres')
const UserSchema = require('../db/strategies/postgres/schema/userSchema')

let app = {}

const USER = {
    username: 'testeuser',
    password: 'EuTestandoSenha123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$12$VJKG1Lw374pI5FpkJt6PbOB6B/mCNF1Za8wqZJ6oHox5lFq1aebS2'
}

describe('Auth heroes testing', function () {

    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        
        const contextPostgres = new Context(new Postgres( connectionPostgres, model))

        await contextPostgres.update(null, USER_DB, true)
    })

    it('Get Token', async ()=>{
        const result = await app.inject({
            url: '/login',
            method: 'POST',
            payload: USER
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.token.length > 10)

    })

    it('User not auth', async ()=>{
        const result = await app.inject({
            url: '/login',
            method: 'POST',
            payload: {
                username: 'testeuser',
                password: 'tupiguarani'
            }
        })

        const data = JSON.parse(result.payload)

        const statusCode = result.statusCode
        
        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(data.error, 'Unauthorized')
    })

})