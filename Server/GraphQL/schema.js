"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const database_1 = require("../Postgres/database/database");
const mqttConnect_1 = __importDefault(require("./mqttConnect"));
var name = '';
const MN = 'MongoName';
const MI = 'MongoID';
const GN = 'GraphName';
const GI = 'GraphID';
function connexionClient() {
    mqttConnect_1.default.on('connect', () => {
        console.log('connected');
        mqttConnect_1.default.subscribe([MN], { qos: 1 }, () => {
            console.log(`Subscribe to topic '${MN}'`);
        });
        mqttConnect_1.default.subscribe([MI], { qos: 1 }, () => {
            console.log(`Subscribe to topic '${MI}'`);
        });
    });
}
exports.default = connexionClient;
mqttConnect_1.default.on('message', (topic, payload) => {
    if (topic === MN) {
        name = payload.toString();
        console.log('Received Message:', topic, name);
        (0, database_1.database)('todos').insert({
            title: name,
            done: false
        });
    }
    if (topic === MI) {
        id = payload.toString();
        console.log('Received Mesage:', topic, id);
    }
});
const TaskType = new graphql_1.GraphQLObjectType({
    name: 'todos',
    description: 'todos',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        done: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLBoolean) }
    })
});
const RootQueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        todos: {
            type: new graphql_1.GraphQLList(TaskType),
            description: 'List of Tasks',
            resolve: () => (database_1)('todos').select('*').from('todos')
        },
        getTask: {
            type: new graphql_1.GraphQLList(TaskType),
            description: 'Get a specific task',
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => (0, database_1.database)('todos').select().from('todos').where('id', args.id)
        }
    })
});
const RootMutationType = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addTask: {
            type: TaskType,
            description: 'Add a task',
            args: {
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            resolve: async (parent, args) => {
                const todo =await (database_1)('todos')
                    .insert({
                    title: args.title,
                    done: false
                })
                .returning('id')
                .then((id) => {
                    console.log(id)
                    mqttConnect_1.default.publish(GN,JSON.stringify({"title": args.title, "id": id[0].id}), { qos: 1 }, (error) => {
                        
                        if (error) {
                            console.error(error);
                            return 0;
                        }
                        console.log('Name published'); 
                    }); 
                })
                return todo
            }
        },
        deleteTask: {
            type: TaskType,
            description: 'Delete a task',
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            resolve: (parent, args) => {
                mqttConnect_1.default.publish(GI, args.id.toString(), { qos: 1 }, (error) => {
                    if (error) {
                        console.error(error);
                        return 0;
                    }
                    console.log('Name published');
                });
                return (database_1)('todos')
                    .where('id', args.id)
                    .del();
            }
        }
    })
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});
