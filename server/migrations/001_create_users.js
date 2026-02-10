"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Kysely } = require("kysely");
async function up(db) {
    await db.schema
        .createTable("users")
        .addColumn("id", "serial", (col) => col.primaryKey())
        .addColumn("email", "text", (col) => col.notNull().unique())
        .addColumn("password", "text", (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable("users").execute();
}
module.exports = { up, down };
//# sourceMappingURL=001_create_users.js.map