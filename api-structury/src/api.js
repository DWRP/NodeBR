const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schema/heroesSchemas')

const HeroRoutes = require('./routes/hero/hero.routes')
const PathRoutes = require('./routes/path/path.routes')


function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}


const app = new Hapi.Server({
    port: 3001
})

async function main() {
    const conn = await Mongodb.connect()
    const context = new Context(new Mongodb( conn, HeroSchema))

    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
        ...mapRoutes(new PathRoutes(), PathRoutes.methods())
    ])

    await app.start()
    console.log('💥 Server running in port: ', app.info.port)
    return app
}

module.exports = main()
