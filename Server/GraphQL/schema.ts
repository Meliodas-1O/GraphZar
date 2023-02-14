import { GraphQLSchema, GraphQLObjectType, GraphQLString,GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLScalarType, GraphQLID } from 'graphql';
import {database} from '../Postgres/database/database'
import client from './mqttConnect'

var name : string = '' ;
var id : string = '' ;

const MN = 'MongoName'
const MI = 'MongoID'

const GN = 'GraphName'
const GI = 'GraphID'

export default function connexionClient(){

    client.on('connect', () => {

        console.log('connected')

        client.subscribe([MN], { qos: 1}, () => {
            console.log(`Subscribe to topic '${MN}'`)
        })  
        
        client.subscribe([MI],{ qos: 1}, () => {
            console.log(`Subscribe to topic '${MI}'`)
        })  
    })
}

client.on('message', (topic: string, payload: { toString: () => string } ) => {
    if (topic ===MN){
        name = payload.toString();
        console.log('Received Message:', topic, name)
        database('todos').insert({
            title : name,
            done : false
        })
    }
    if (topic === MI){
        var mid : string= payload.toString()
        id = toInt
        console.log('Received Mesage:', topic, id)
        database('todos')
        .where('id',id)
        .del()
    }
})

const TaskType = new GraphQLObjectType({
    name : 'todos',
    description : 'todos',
    fields : () => ({
        id : {type : GraphQLNonNull(GraphQLInt)},
        title : {type : GraphQLNonNull(GraphQLString)},
        done : {type :GraphQLNonNull(GraphQLBoolean)}
    })
})

const RootQueryType = new GraphQLObjectType({
    name : 'Query',
    description : 'Root Query',
    fields: () => ({
        todos:{
            type : new GraphQLList(TaskType),
            description : 'List of Tasks',
            resolve : () => database('todos').select('*').from('todos')
        },
        getTask:{
            type : new GraphQLList(TaskType),
            description : 'Get a specific task',
            args : {
                id : {type : GraphQLNonNull(GraphQLInt)}
            },
            resolve : (parent, args) => database('todos').select().from('todos').where('id',args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name : 'Mutation',
    description : 'Root Mutation',
    fields: () => ({
        addTask : {
            type : TaskType,
            description : 'Add a task',
            args : {
                title : { type : GraphQLNonNull(GraphQLString)}
            },
            resolve : (parent, args) => {
                var temp = database('todos').max('id')
                console.log(temp)
                client.publish(GN, JSON.stringify({title:args.title,done:false}) ,{ qos: 1}, (error: any) => {
                    if (error) {
                        console.error(error)
                        return 0
                    }
                    console.log('Name published')
                })

                return database('todos')
                .insert({
                    title: args.title,
                    done: false
                })
            }
        }, 
        deleteTask : {
            type : TaskType,
            description : 'Delete a task',
            args : {
                id : {type : GraphQLNonNull(GraphQLInt)}
            },
            resolve : (parent, args) => {

                client.publish(GI, args.id.toString() ,{ qos: 1}, (error: any) => {
                    if (error) {
                        console.error(error)
                        return 0
                    }
                    console.log('Name published')
                })

                return database('todos')
                .where('id',args.id)
                .del()
            }
        }
    })
})

export const schema = new GraphQLSchema({
    query : RootQueryType,
    mutation : RootMutationType
})

