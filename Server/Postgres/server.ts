import express from 'express'
import bp from 'body-parser'

const knex = require('./database/database');


const app = express();

app.use(bp.json())
app.use(bp.urlencoded({extended : false}))

app.listen(5055,()=>{
    console.log('   Ok lets gooooo');
})

app.get('/todos', (req,res)=>{
    knex
    .select()
    .from('todos')
    .then( (todos : any) => res.send(todos))
})

app.get('/todos/:id', (req,res) =>{
    knex
    .select()
    .from('todos')
    .where('id',req.params.id)
    .then((todos:any)=>{
        res.send(todos)
    })
})

app.post('/todos', (req,res)=>{
    knex('todos')
    .insert({
        title : req.body.title,
        done : false
    })
    .then (() =>{
        knex
        .select().from('todos')
        .then((todos : any)=>res.send(todos))
    })
})

app.put('/todos/:id',(req,res)=>{
    knex('todos')
    .where('id',req.params.id)
    .update({
        title: req.body.title,
        done : req.body.done
    })
    .then(()=>{
        knex.select().from('todos')
        .then((todos : any) =>{
            res.send(todos);
        })
    })
})

app.delete('/todos/:id', (req,res)=>{
    knex('todos')
    .where('id',req.params.id)
    .del()
    .then(() =>{
        knex.select().from('todos')
        .then((todos:any) =>{
            res.send(todos)
        })
    })
})