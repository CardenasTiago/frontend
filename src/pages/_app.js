
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default (app) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
  });
  app.use(vuetify);
};