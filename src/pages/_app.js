
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createPinia } from 'pinia'

export default (app) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: false,
  });
  const pinia = createPinia()

  //dependencias
  app.use(pinia)
  app.use(vuetify);
};