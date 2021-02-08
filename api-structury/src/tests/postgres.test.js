const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const Context = require('../db/strategies/base/contextStrategy')
const HeroSchema = require('../db/strategies/postgres/schema/heroesSchema')

let context = {}

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
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroSchema)
        context = new Context(new Postgres(connection, model))

        await context.delete()
        await context.create(MOCK_UPDATE_HERO)
    })

    it('Postgres SQL conection',async ()=>{
        const result = await context.isConnected()
        assert.strictEqual(result, true)
    })

    it('Register a hero',async ()=>{
        const result = await context.create(MOCK_REGISTER_HERO)
        delete result.id
        assert.deepStrictEqual(result, MOCK_REGISTER_HERO)
    })
    
    it('List heros',async ()=>{
        const [result] = await context.read({name:MOCK_REGISTER_HERO.name})
        delete result.id
        assert.deepStrictEqual(result, MOCK_REGISTER_HERO)
    })

    it('Update a hero',async ()=>{
        const [itemUpdate] = await context.read({name:MOCK_UPDATE_HERO.name})

        const newItem = {
            ...MOCK_UPDATE_HERO,
            name: 'Superman'
        }
        
        await context.update(itemUpdate.id, newItem)
        
        const [result] = await context.read({id: itemUpdate.id})

        assert.deepStrictEqual(result.name, newItem.name)
    })

    it('Remove by id',async ()=>{
        const [item] = await context.read({})

        const result = await context.delete(item.id)

        assert.deepStrictEqual(result, 1)
    })
})