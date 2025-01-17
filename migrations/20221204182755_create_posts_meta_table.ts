import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('posts_meta', (table) => {
      table.string('type', 64).notNullable()
      table.string('value', 512).notNullable()
      table.primary(['post_id', 'type'])
      table.string('post_id', 36)
        .references('id')
        .inTable('posts')
        .notNullable()
        .onDelete('CASCADE')
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts_meta')
}
