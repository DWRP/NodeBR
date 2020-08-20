const Postgres = require('./db/strategies/postgres')
const driver = Postgres

async function main(){
    const Heroes = ""

    await Heroes.sync()

    // await Heroes.create({
    //     name: 'Supergirl',
    //     power: 'Ultrapower'
    // })

    const result = await Heroes.findAll({raw:true})

    console.log('result: ', result)
}

main()