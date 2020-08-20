const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(Postgres)

const MOCK_REGISTER_HERO = {
    name: 'Black Hawk',
    power: 'fly'
}

const MOCK_UPDATE_HERO = {
    name: 'Batman',
    power: 'Money'
}

describe('Postgres Strategy', function (){
    this.timeout(Infinity)

    this.beforeAll(async function(){
        await context.connect()
        await context.delete()
        await context.create(MOCK_UPDATE_HERO)
    })

    it('Postgres SQL conection',async ()=>{
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Register a hero',async ()=>{
        const result = await context.create(MOCK_REGISTER_HERO)
        delete result.id
        assert.deepEqual(result, MOCK_REGISTER_HERO)
    })
    
    it('List heros',async ()=>{
        const [result] = await context.read({name:MOCK_REGISTER_HERO.name})
        delete result.id
        assert.deepEqual(result, MOCK_REGISTER_HERO)
    })

    it('Update a hero',async ()=>{
        const [itemUpdate] = await context.read({name:MOCK_UPDATE_HERO.name})
        const newItem = {
            ...MOCK_UPDATE_HERO,
            name: 'Superman'
        }
        await context.update(itemUpdate.id, newItem)

        const [result] = await context.read({id: itemUpdate.id})

        assert.deepEqual(result.name, newItem.name)
    })

    it('Remove by id',async ()=>{
        const [item] = await context.read({})

        const result = await context.delete(item.id)

        assert.deepEqual(result, 1)
    })
})