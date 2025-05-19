exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.timestamps(true, true);
    })
    .createTable("parfums", (table) => {
      table.increments("parfum_id").primary();
      table.string("name").notNullable();
      table.string("brand").notNullable();
      table.text("description");
      table.string("image_url");
      table.string("official_url");
      table.text("notes");
      table.string("gender");
      table.string("price_range");
      table.timestamps(true, true);
    })
    .createTable("wishlists", (table) => {
      table.increments("wishlist_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("users.user_id").onDelete("CASCADE");
      table.timestamps(true, true);
    })
    .createTable("wishlist_parfum", (table) => {
      table.integer("wishlist_id").unsigned().notNullable();
      table.integer("parfum_id").unsigned().notNullable();
      table
        .foreign("wishlist_id")
        .references("wishlists.wishlist_id")
        .onDelete("CASCADE");
      table
        .foreign("parfum_id")
        .references("parfums.parfum_id")
        .onDelete("CASCADE");
      table.primary(["wishlist_id", "parfum_id"]);
      table.timestamps(true, true);
    })
    .createTable("interactions", (table) => {
      table.increments("interaction_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("parfum_id").unsigned().notNullable();
      table.string("action_type").notNullable();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
      table.foreign("user_id").references("users.user_id").onDelete("CASCADE");
      table
        .foreign("parfum_id")
        .references("parfums.parfum_id")
        .onDelete("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("interactions")
    .dropTableIfExists("wishlist_parfum")
    .dropTableIfExists("wishlists")
    .dropTableIfExists("parfums")
    .dropTableIfExists("users");
};
