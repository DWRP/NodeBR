class BasicRoute {
    static methods(){
        return Object.getOwnPropertyNames(this.prototype)
                    .filter(method => method !== 'constructor' && !method.startsWith('_'))
    }
}

module.exports = BasicRoute