const Mongoose = require('mongoose');

Mongoose.connect('mongodb+srv://dwrp_app_master:Ncpijkpl-1@dwarp.wgmsh.gcp.mongodb.net/heroes?retryWrites=true&w=majority', 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,   
    },
    function (error) {
        if(!error) return ;
        console.log('Falha na conexão', error.message)
    }
)

const connection = Mongoose.connection
connection.once('open', ()=>{
    console.log('Database Running')
})


const heroSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: true,
    },
    insertedAt:{
        type: Date,
        default: new Date()
    }

})

const model = Mongoose.model('heroes',heroSchema)

async function main() {
    const resultRegister = await model.create({
        name: 'Batman',
        power: 'Money'
    })

    console.log(resultRegister)
}

main()