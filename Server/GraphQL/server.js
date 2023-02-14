"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const schema_2 = __importDefault(require("./schema"));
const expressGraphQL = require('express-graphql').graphqlHTTP;
const app = (0, express_1.default)();
(0, schema_2.default)();
app.use((0, cors_1.default)());
app.use('/graphql', expressGraphQL({
    schema: schema_1.schema,
    graphiql: true
}));
app.listen(7000, () => console.log('Server running bla'));
