"use server";
import getConfig from "next/config";

//////////////////////////////////////////////////
///////////// Set Runtime Variables //////////////
//////////////////////////////////////////////////
const { serverRuntimeConfig } = getConfig() || {};

let tenantID = 0;
let apiBackendURL = "";
let accessToken = "";

if (serverRuntimeConfig) {
  tenantID = serverRuntimeConfig.TENANT_ID;
  apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER;
  accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER;
}
export const loadPostData = async (postData) => {
  const { serverRuntimeConfig } = getConfig() || {};
  if (serverRuntimeConfig) {
    serverRuntimeConfig.TEMP_DATA = {};
    serverRuntimeConfig.TEMP_DATA = postData;
  }
};
//////////////////////////////////////////////////
///////////// Set Runtime Variables///////////////
//////////////////////////////////////////////////

// Add new Opportunity record in db
export const createOpportunityAction = async (
  apiBackendURL,
  accessToken,
  formData
) => {
  const apiUrl = `${apiBackendURL}auth/signup`;

  const headers = new Headers({
    cache: "no-store",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const now = new Date();
  const formattedTimestamp = now.toISOString();
  const formatedDate = now.toISOString().split("T")[0];

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      tenant_id: formData.team_id,
      team_id: formData.team_id,
      designation_id: formData.designation_id,
      company_id: formData.company_id,
      user_name: formData.user_name,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      middle_name: "",
      last_name: formData.last_name,
      user_role: "",
      role_level: "",
      registration_date: formatedDate,
      last_login_at: formatedDate,
      created_at: formattedTimestamp,
      updated_at: formattedTimestamp,
      active: formData.tenant_is_active === "Active" ? true : false,
      verified: formData.tenant_is_active === "Active" ? true : false,
      password_salt: "",
      user_profile_photo: "",
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Opportunity creation failed",
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      returnData: result,
    };
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Opportunity creation failed",
    };
  }
};

// Update Opportunity record in db
export const updateOpportunityRecordAction = async (formData, user_id) => {
  const apiUrl = `${apiBackendURL}auth/auth/users/id/${user_id}`;
  console.log(apiUrl);
  const headers = new Headers({
    cache: "no-store",
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  });

  const now = new Date();
  const formattedTimestamp = now.toISOString();
  const formatedDate = now.toISOString().split("T")[0];

  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({
      tenant_id: 1,
      team_id: formData.team_id,
      designation_id: formData.designation_id,
      company_id: formData.company_id,
      user_name: "UNAME",
      email: "user@example.com",
      password: formData.password,
      first_name: formData.first_name,
      middle_name: "",
      last_name: formData.last_name,
      user_role: "",
      role_level: "",
      registration_date: formatedDate,
      last_login_at: formattedTimestamp,
      created_at: formattedTimestamp,
      updated_at: formattedTimestamp,
      active: false,
      verified: false,
      password_salt: "",
      user_profile_photo: "",
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Opportunity update failed",
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      returnData: result,
    };
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Opportunity updation failed",
    };
  }
};

// delete a Opportunity record from db
export const deleteOpportunityRecordAction = async (user_id) => {
  try {
    const url = `${apiBackendURL}auth/auth/users/id/${user_id}`;

    const response = await fetch(url, {
      cache: "no-store",
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Request failed for Opportunity",
      };
    }
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Request failed for Opportunity",
    };
  }
};

// get all Opportunity records from db
export const getAllOpportunityRecordsAction = async () => {
  try {
    const url = `${apiBackendURL}auth/auth/users/tenant/${tenantID}`;

    const response = await fetch(url, {
      cache: "no-store",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Request failed for Opportunity",
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      returnData: result,
    };
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Request failed for Opportunity",
    };
  }
};
