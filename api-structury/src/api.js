const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const Mongodb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schema/heroesSchema')
const Postgres = require('./db/strategies/postgres/postgres')
const UserSchema = require('./db/strategies/postgres/schema/UserSchema')

const HeroRoutes = require('./routes/hero/hero.routes')
const PathRoutes = require('./routes/path/path.routes')
const AuthRoutes = require('./routes/auth/auth.routes')

const HapiSwagger = require('hapi-swagger')
const HapiJwt = require('hapi-auth-jwt2')
const Vision = require('vision')
const Inert = require('inert')
const Blipp = require('blipp')
const Dotenv = require('dotenv')

Dotenv.config()

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}


const app = new Hapi.Server({
    port: 3001
})

async function main() {
    const connMongo = await Mongodb.connect()
    const connPostgres = await Postgres.connect()

    const model = await Postgres.defineModel(connPostgres, UserSchema)

    const contextMongo = new Context(new Mongodb( connMongo, HeroSchema))
    const contextPostgres = new Context(new Postgres( connPostgres, model))

    const SwaggerOptions = {
        info: {
            title: 'API Heroes - Course NodeBR',
            version: 'v1.0'
        },
        tags: [
            {
                name: 'heroes',
                description: 'Heroes configs',
            }
        ],
        lang: 'pt'
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        Blipp,
        {
            plugin: HapiSwagger,
            options: SwaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        // options: {
        //     expiresIn:
        // }

        validate: (data, request) => {
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')

    app.route([
        ...mapRoutes(new HeroRoutes(contextMongo), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(process.env.JWT_SECRET, contextPostgres), AuthRoutes.methods()),
        ...mapRoutes(new PathRoutes(), PathRoutes.methods()),
    ])

    await app.start()
    console.log('💥 Server running in port: ', app.info.port)
    return app
}

module.exports = main()
