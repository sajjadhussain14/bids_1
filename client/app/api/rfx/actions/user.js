'use server'

import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig() || {};

let tenantID=0
let apiBackendURL=''
let accessToken = ''

if (serverRuntimeConfig) {
    tenantID=serverRuntimeConfig.TENANT_ID 
    apiBackendURL=serverRuntimeConfig.API_BACKEND_SERVER
    accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER
}
export const loadPostData = async (postData) => {

    const { serverRuntimeConfig } = getConfig() || {};
    if (serverRuntimeConfig) {
        serverRuntimeConfig.TEMP_DATA={}
        serverRuntimeConfig.TEMP_DATA=postData
    }

}

//////////////////////////////////////////////////////
///////////////// Configuration settings/////////////
/////////////////////////////////////////////////////


export const getAllUsers = async () => {
    try {
        const url = `${apiBackendURL}auth/auth/users/tenant/${tenantID}`;
    
        const response = await fetch(url, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          redirect: 'follow',
        });
        if (!response.ok) {
          return {
            statusCode: "400",
            data: [],
            error: response.statusText || 'Request failed for Users',
          };
        }
    
        const result = await response.json();
    
        return {
          statusCode: 200,
          data: result,
        };
    
      } catch (error) {
  
        return {
          statusCode: "400",
          data: [],
          error: error.message || 'Request failed for Users',
        };
      }
  
  }

  
  export const getUserById = async (userID) => {
    try {
        const url = `${apiBackendURL}auth/auth/users/id/${userID}`;
  
        const response = await fetch(url, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          redirect: 'follow',
        });
        if (!response.ok) {
          return {
            statusCode: "400",
            data: {},
            error: response.statusText || 'Request failed for User',
          };
        }
    
        const result = await response.json();
    
        return {
          statusCode: 200,
          data: result,
        };
    
      } catch (error) {
  
        return {
          statusCode: "400",
          data: [],
          error: error.message || 'Request failed for User',
        };
      }
  
  }
   