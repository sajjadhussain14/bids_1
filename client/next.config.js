/** @type {import('next').NextConfig} */

if (process.env.NODE_ENV == "development") {
  bakend = "http://localhost:8888/";
} else {
  bakend = "http://54.203.61.57:31278/";

  // remove this on aws
  bakend = "http://localhost:8888/";
}

bakend = "https://server.bidsforce.com/";


const nextConfig = {


  // for server side
  serverRuntimeConfig: {
    API_BACKEND_SERVER: bakend,
    API_ACCESS_TOKEN_SERVER: " ",
    TENANT_ID: 0,
    TEMP_DATA: {},
    LOGIN_USER_DATA: {},
    PRIVATE_ENCRIPTED_USER_DATA: {user:'',pass:""},
    IS_LOGIN: false,
    eslint: {ignoreDuringBuilds: true},

  },

  // for client side
  env: {
    API_BACKEND_CLIENT: bakend,
    TENANT_ID: "0",
  },

  // Will be available on both server-side and client-side
  publicRuntimeConfig:{
    API_BACKEND_CLIENT: bakend,
    TENANT_ID: "0",

  },

  reactStrictMode: true, 
  eslint: { 
    ignoreDuringBuilds: true, 
  }, 

};

module.exports = nextConfig;
