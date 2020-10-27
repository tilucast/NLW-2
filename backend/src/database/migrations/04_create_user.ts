import Knex from 'knex'

export async function up(knex: Knex){
    return knex.schema.createTable('user', table =>{
        table.string('name').notNullable()
        table.string('surname').notNullable()
        table.string('bio').nullable()
        table.string('email').primary()
        table.string('password').notNullable()
        table.string('whatsapp').nullable()
        table.string('path').nullable()
    })
}

export async function down(knex: Knex){
    return knex.schema.dropTable('user')
}