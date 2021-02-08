const BasicRoute = require('../base/base.routes')

class PathRoutes extends BasicRoute{
    constructor (){
        super()
    }

    index(){
        return {
            path: '/',
            method: 'GET',
            config: {
                auth: false
            },
            handler: (request, head) => {
                return {status: 'running'}
            }
        }
    }
}

module.exports = PathRoutes