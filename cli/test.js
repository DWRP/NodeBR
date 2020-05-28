const {
    deepEqual,
    ok
} = require('assert')

const database = require('./database')

const DEFAULT_ITEM_REGISTER = {
    id:1,
    name:"Flash", 
    power:"Speed"
}
const DEFAULT_ITEM_UPDATE = {
    id:2,
    name:"Green Lantern", 
    power:"Ring Power"
}

describe('Switch Heros manipulation', ()=>{
    before(async ()=>{
        await database.register(DEFAULT_ITEM_REGISTER)
        await database.register(DEFAULT_ITEM_UPDATE)
    })
    it('Search hero using files', async ()=>{
        const expected = DEFAULT_ITEM_REGISTER
        const [result] = await database.listIn(expected.id)
        deepEqual(result,expected)
    })
    it('register a hero, using files', async ()=>{
        const expected = DEFAULT_ITEM_REGISTER
        const result = await database.register(DEFAULT_ITEM_REGISTER)
        const [current] = await database.listIn(DEFAULT_ITEM_REGISTER.id)
        
        deepEqual(current,expected)
    })
    it('remove a hero, using files', async ()=>{
        const expected = true
        
        const result = await database.remove(DEFAULT_ITEM_REGISTER.id)

        deepEqual(result,expected)
    })
    it('Update a hero, using files', async ()=>{
        const expected = {
            ...DEFAULT_ITEM_UPDATE,
            name:'Batman',
            power:'Money'
        }

        const newValue = {
            name:'Batman',
            power:'Money'
        } 
        
        await database.update(DEFAULT_ITEM_UPDATE.id,newValue)

        const [result] = await database.listIn(DEFAULT_ITEM_UPDATE.id)

        deepEqual(result,expected)
    })
})