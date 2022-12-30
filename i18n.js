import i18next, { use } from "i18next";
import { initReactI18next } from "react-i18next";

import appConfig from "./app/i18n/app.config";

const resources = {};

use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    resources,
    lng: "vi",
    fallbackLng: "vi",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    initImmediate: false,
  })
  .then(() => {
    appConfig(i18next);
  });

export default i18next;
