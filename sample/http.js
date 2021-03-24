const fastify = require('fastify')()

fastify.register(require('fastify-static'), {
  root: __dirname
})

fastify.get('/', function (req, reply) {
    return reply.sendFile('index.html')
})

fastify.listen(8080, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})