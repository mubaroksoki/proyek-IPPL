exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("interactions").del();
  await knex("wishlist_parfum").del();
  await knex("wishlists").del();
  await knex("parfums").del();
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
    {
      name: "Test User",
      email: "test@example.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    },
  ]);

  await knex("parfums").insert([
    {
      name: "Sauvage",
      brand: "Dior",
      description: "A fresh spicy fragrance for men",
      image_url: "https://example.com/sauvage.jpg",
      official_url: "https://www.dior.com/sauvage",
      notes: "Bergamot, Ambroxan, Pepper",
      gender: "male",
      price_range: "high",
    },
    {
      name: "J'adore",
      brand: "Dior",
      description: "A floral fragrance for women",
      image_url: "https://example.com/jadore.jpg",
      official_url: "https://www.dior.com/jadore",
      notes: "Jasmine, Rose, Ylang-Ylang",
      gender: "female",
      price_range: "high",
    },
    {
      name: "Light Blue",
      brand: "Dolce & Gabbana",
      description: "A fresh citrus fragrance",
      image_url: "https://example.com/lightblue.jpg",
      official_url: "https://www.dolcegabbana.com/lightblue",
      notes: "Lemon, Apple, Cedar",
      gender: "unisex",
      price_range: "medium",
    },
    {
      name: "Black Opium",
      brand: "Yves Saint Laurent",
      description: "A sweet oriental fragrance for women",
      image_url: "https://example.com/blackopium.jpg",
      official_url: "https://www.ysl.com/blackopium",
      notes: "Coffee, Vanilla, White Flowers",
      gender: "female",
      price_range: "high",
    },
    {
      name: "Acqua di Gio",
      brand: "Armani",
      description: "A fresh aquatic fragrance for men",
      image_url: "https://example.com/acqua.jpg",
      official_url: "https://www.armanibeauty.com/acqua",
      notes: "Marine Notes, Citrus, Musk",
      gender: "male",
      price_range: "medium",
    },
  ]);

  await knex("wishlists").insert([{ user_id: 1 }, { user_id: 2 }]);

  await knex("wishlist_parfum").insert([
    { wishlist_id: 1, parfum_id: 1 },
    { wishlist_id: 1, parfum_id: 3 },
    { wishlist_id: 2, parfum_id: 2 },
  ]);

  await knex("interactions").insert([
    { user_id: 1, parfum_id: 1, action_type: "view" },
    { user_id: 1, parfum_id: 3, action_type: "view" },
    { user_id: 1, parfum_id: 1, action_type: "wishlist_add" },
    { user_id: 2, parfum_id: 2, action_type: "view" },
    { user_id: 2, parfum_id: 4, action_type: "view" },
    { user_id: 2, parfum_id: 2, action_type: "wishlist_add" },
  ]);
};
