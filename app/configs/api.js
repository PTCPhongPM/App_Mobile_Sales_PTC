//const domain = "https://ptc.ansuzdev.com";
//const domain = "https://apiptc.phattien.net:8009";
const domain = "https://apitest.phattien.net"; //test
const version = "v1";

const baseURL = `${domain}/api/${version}`;
const accessTokenKey = "accessTokenKey";

const apiConfig = {
  baseURL,
  accessTokenKey,
};

export default apiConfig;
