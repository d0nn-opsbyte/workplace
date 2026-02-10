const { Kysely } = require("kysely");

import type { Kysely as KyselyType, ColumnBuilderCallback } from "kysely";

async function up(db: KyselyType<any>) {
  await db.schema
    .createTable("users")
    .addColumn("id", "serial", (col: any) => col.primaryKey())
    .addColumn("email", "text", (col: any) => col.notNull().unique())
    .addColumn("password", "text", (col: any) => col.notNull())
    .execute();
}

async function down(db: KyselyType<any>) {
  await db.schema.dropTable("users").execute();
}

module.exports = { up, down };
