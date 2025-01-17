import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('verification_tokens', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('token', 256).notNullable().unique()
      table.string('user_email', 256).notNullable().unique()
      table.string('type', 20).notNullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
      table.index(['token', 'user_email'])
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('verification_tokens')
}
