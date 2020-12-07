const {ApolloServer}= require('apollo-server')
const resolvers= require('./graphql/resolvers')
const typeDefs= require('./graphql/typeDefs') 
const {sequelize}= require('./models/index')
const contextMiddleware= require('./middleware/context')



const server= new ApolloServer({
    typeDefs,
    resolvers,
    context: ctx=> contextMiddleware(ctx) 
})


server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)

    sequelize.authenticate().then(()=>{
        console.log('Database Connected!')
    }).catch(err=>console.log(err))
})

