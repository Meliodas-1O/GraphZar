"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const knex = require('./database/database');
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.listen(5055, () => {
    console.log('   Ok lets gooooo');
});
app.get('/todos', (req, res) => {
    knex
        .select()
        .from('todos')
        .then((todos) => res.send(todos));
});
app.get('/todos/:id', (req, res) => {
    knex
        .select()
        .from('todos')
        .where('id', req.params.id)
        .then((todos) => {
        res.send(todos);
    });
});
app.post('/todos', (req, res) => {
    knex('todos')
        .insert({
        title: req.body.title,
        done: false
    })
        .then(() => {
        knex
            .select().from('todos')
            .then((todos) => res.send(todos));
    });
});
app.put('/todos/:id', (req, res) => {
    knex('todos')
        .where('id', req.params.id)
        .update({
        title: req.body.title,
        done: req.body.done
    })
        .then(() => {
        knex.select().from('todos')
            .then((todos) => {
            res.send(todos);
        });
    });
});
app.delete('/todos/:id', (req, res) => {
    knex('todos')
        .where('id', req.params.id)
        .del()
        .then(() => {
        knex.select().from('todos')
            .then((todos) => {
            res.send(todos);
        });
    });
});
