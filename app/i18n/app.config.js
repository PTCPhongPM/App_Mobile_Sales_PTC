import en from "./en";
import vi from "./vi";

export default function appConfig(i18next) {
  i18next.addResourceBundle("en", "common", en);
  i18next.addResourceBundle("vi", "common", vi);
}
