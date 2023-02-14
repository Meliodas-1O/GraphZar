import express from 'express';
import cors from 'cors';
import { schema } from './schema';
import connexionClient from './schema'


const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express()

connexionClient()
app.use(cors())

app.use('/graphql', expressGraphQL({
    schema : schema,
    graphiql:true
}))

app.listen (7000, () => console.log('Server running bla'))
