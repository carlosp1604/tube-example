import { Knex } from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema
    .createTable('post_tags', (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('slug', 64).notNullable().unique()
      table.string('name', 64).notNullable().index()
      table.string('description', 1024).nullable()
      table.string('image_url', 256).nullable()
      table.timestamps(true, true)
      table.timestamp('deleted_at')
        .defaultTo(null)
    })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('post_tags')
}
