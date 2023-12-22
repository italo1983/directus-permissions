export default ({ filter }, { services }) => {
  filter(
    "settings.read",
    async (items, meta, { database: knex, schema, accountability }) => {
      console.log(items);
      if (accountability && !accountability.admin) {
        const { ItemsService } = services;
        const service = new ItemsService("directus_roles", {
          knex,
          schema,
          accountability,
        });
        const rol = accountability.role;
        const rolFind = await service.knex
          .from("directus_roles")
          .where({ id: rol })
          .first();
        const rolName = rolFind?.name?.toLowerCase();
        var settings = items[0];
        settings.module_bar = items[0].module_bar.map((module) => {
          if (module.id === "users") {
            module.enabled = false;
          }
          if (module.id === "reports" && rolName == "vendor") {
            module.enabled = false;
          }
          if (module.id === "contacts" && rolName == "vendor") {
            module.enabled = false;
          }
          if (module.id === "files" && rolName == "vendor") {
            module.enabled = false;
          }

          return module;
        });
      }
      return items;
    }
  );
};
