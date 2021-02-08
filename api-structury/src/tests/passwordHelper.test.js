const assert = require('assert')

const PasswordHelper = require('../helpers/passwordHelper')
// const api = require('./../api')
// let app = {}

const PASSWORD = 'EuTestandoSenha123'
const HASH = '$2b$12$VJKG1Lw374pI5FpkJt6PbOB6B/mCNF1Za8wqZJ6oHox5lFq1aebS2'

describe('Userhelp test', function () {
    it('Has generete has at password', async ()=>{
        const result = await PasswordHelper.hashPassword(PASSWORD)
        assert.ok(result.length > 10)
    })

    it('Validate user password', async ()=>{
        const result = await PasswordHelper.comparePassword(PASSWORD,HASH)
        assert.ok(result)
    })

})