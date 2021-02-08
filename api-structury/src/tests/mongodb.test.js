const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb/mongodb')
const HeroSchema = require('../db/strategies/mongodb/schema/heroesSchema')
const Context = require('../db/strategies/base/contextStrategy')

let context = {}

const MOCK_DEFAULT_HERO = {
    name: `Flash-${Date.now()}`,
    power: 'fasted'
}
const MOCK_REGISTER_HERO = {
    name: 'Black Hawk',
    power: 'fly'
}

const MOCK_UPDATE_HERO = {
    name: 'Batman',
    power: 'Money'
}

let MOCK_HERO_ID = ''

describe('Mongodb Strategy', function (){

    this.beforeAll(async function(){
        const connection = await Mongodb.connect()
        context = new Context(new Mongodb(connection, HeroSchema))
        
        await context.create(MOCK_DEFAULT_HERO)
        const result =  await context.create(MOCK_UPDATE_HERO)
        MOCK_HERO_ID = result._id
    })

    it('MongoDB SQL conection', async ()=>{
        const result = await context.isConnected()
        assert.strictEqual(result, 'Connected')
    })

    it('Register a hero', async ()=>{
        const { name, power } = await context.create(MOCK_REGISTER_HERO)
        assert.deepStrictEqual({ name, power }, MOCK_REGISTER_HERO)
    })
    
    it('List heros',async ()=>{
        const [{ name, power }] = await context.read({name:MOCK_DEFAULT_HERO.name})
        assert.deepStrictEqual({ name, power }, MOCK_DEFAULT_HERO)
    })

    it('Update a hero',async ()=>{
        const newItem = {
            name: 'The Batman'
        }

        const result = await context.update(MOCK_HERO_ID, newItem)

        assert.deepStrictEqual(result.nModified, 1)
    })

    it('Remove by id',async ()=>{
        const result = await context.delete(MOCK_HERO_ID)

        assert.deepStrictEqual(result.n, 1)
    })
})