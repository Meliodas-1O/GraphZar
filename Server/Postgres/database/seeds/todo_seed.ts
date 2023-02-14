import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("todos").del();

    // Inserts seed entries
    await knex("todos").insert([
        { 
            id: 1, 
            title: "rowValue1",
            done : false
        },        
        { 
            id: 2, 
            title: "rowValue2",
            done : false
        },
        { 
            id: 3, 
            title: "rowValue3",
            done : false
        },
    ]);
};
