const Commander = require('commander')

const Hero = require('./hero')
const Database = require('./database')

// const {} = require('')

async function main(){
    Commander
        .version('v0.1')
        .option("-i --id [value]","Hero ID")
        .option("-n --name [value]","Hero Name")
        .option("-p --power [value]","Hero Power")

        .option("-rg --register","Register a Hero")
        .option("-rm --remove","Remove a Hero")
        .option("-ls --list","List all Heroes")
        .option("-up --update [value]","Update a Hero")
        .parse(process.arqv)
    
    const hero = new Hero(Commander)

    try{
        if(Commander.register){
            delete hero.id
            const result = await Database.register(hero)
            if(!result){
                console.error('Hero not register!')
                return;
            }
            console.log('Hero register sucess!')
        }
        if(Commander.list){
            const result = await Database.listIn()
            console.log(result)
        }
        if(Commander.remove){
            const result = await Database.remove(hero.id)
            if(!result){
                console.error('Hero not exist!')
                return;
            }
            console.log('Hero remove sucess!')
        }
        if(Commander.update){

            const idUpdate = parseInt(Commander.update)

            const dataUpdate = JSON.parse(JSON.stringify(hero))

            const result = await Database.update(idUpdate,dataUpdate)

            if(!result){
                console.error('Hero not update!')
                return;
            }
            console.log('Hero update sucess!')
        }
    }catch(error){
        console.log("OH SHIT: ",error)
    }
}

main()