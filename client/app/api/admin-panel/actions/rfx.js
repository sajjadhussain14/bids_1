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

// get all RFx Prerequisite records from db
export const getAllRfxPrereqRecordsAction = async (table_name) => {
  try {
    let url = "";
    if (table_name === "rfx_type") {
      url = `${apiBackendURL}rfx_type/rfx_type/tenant/${tenantID}`;
    } else if (table_name === "rfx_content_submission") {
      url = `${apiBackendURL}rfx_content_submission/rfx_content_submission/tenant/${tenantID}`;
    } else if (table_name === "rfx_submission_mode") {
      url = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/tenant/${tenantID}`;
    } else if (table_name === "rfx_stage") {
      url = `${apiBackendURL}rfx_stage/rfx_stage/tenant/${tenantID}`;
    } else if (table_name === "bid_validity") {
      url = `${apiBackendURL}bid_validity/bid_validity/tenant/${tenantID}`;
    }

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
        error: response.statusText || "Request failed for Rfx Prerequisite",
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
      error: error.message || "Request failed for Rfx Prerequisite",
    };
  }
};

// Add new RFx Prerequisite record in db
export const createRfxPrereqAction = async (formData, table_name) => {
  let apiUrl = "";
  if (table_name === "rfx_type") {
    apiUrl = `${apiBackendURL}rfx_type/rfx_type`;
  } else if (table_name === "rfx_content_submission") {
    apiUrl = `${apiBackendURL}rfx_content_submission/rfx_content_submission/`;
  } else if (table_name === "rfx_submission_mode") {
    apiUrl = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/`;
  } else if (table_name === "rfx_stage") {
    apiUrl = `${apiBackendURL}rfx_stage/rfx_stage/`;
  } else if (table_name === "bid_validity") {
    apiUrl = `${apiBackendURL}bid_validity/bid_validity/`;
  }

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
      tenant_id: tenantID,
      title: formData.title,
      is_active: formData.is_active,
      alias: formData.alias,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Rfx Prerequisite creation failed",
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
      error: error.message || "Rfx Prerequisite creation failed",
    };
  }
};

// Update RFx Prerequisite record in db
export const updateRfxPrereqAction = async (formData, table_name, id) => {
  let apiUrl = "";
  if (table_name === "rfx_type") {
    apiUrl = `${apiBackendURL}rfx_type/rfx_type/id/${id}`;
  } else if (table_name === "rfx_content_submission") {
    apiUrl = `${apiBackendURL}rfx_content_submission/rfx_content_submission/id/${id}`;
  } else if (table_name === "rfx_submission_mode") {
    apiUrl = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/id/${id}`;
  } else if (table_name === "rfx_stage") {
    apiUrl = `${apiBackendURL}rfx_stage/rfx_stage/id/${id}`;
  } else if (table_name === "bid_validity") {
    apiUrl = `${apiBackendURL}bid_validity/bid_validity/id/${id}`;
  }

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
      tenant_id: tenantID,
      title: formData.title,
      is_active: formData.is_active,
      alias: formData.alias,
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || "Rfx Prerequisite creation failed",
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
      error: error.message || "Rfx Prerequisite creation failed",
    };
  }
};

// delete a Rfx Prerequisite record from db
export const deleteRfxPrereqRecordAction = async (table_name, id) => {
  try {
    let apiUrl = "";
    if (table_name === "rfx_type") {
      apiUrl = `${apiBackendURL}rfx_type/rfx_type/id/${id}`;
    } else if (table_name === "rfx_content_submission") {
      apiUrl = `${apiBackendURL}rfx_content_submission/rfx_content_submission/id/${id}`;
    } else if (table_name === "rfx_submission_mode") {
      apiUrl = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/id/${id}`;
    } else if (table_name === "rfx_stage") {
      apiUrl = `${apiBackendURL}rfx_stage/rfx_stage/id/${id}`;
    } else if (table_name === "bid_validity") {
      apiUrl = `${apiBackendURL}bid_validity/bid_validity/id/${id}`;
    }

    const response = await fetch(apiUrl, {
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
        error: response.statusText || "Request failed for Rfx Prerequisite",
      };
    }
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Request failed for Rfx Prerequisite",
    };
  }
};

// delete all Rfx Prerequisite record from db
export const deleteAllRfxPrereqRecordAction = async (table_name) => {
  try {
    let apiUrl = "";
    if (table_name === "rfx_type") {
      apiUrl = `${apiBackendURL}rfx_type/rfx_type/all-rfx/tenant_id/${tenantID}`;
    } else if (table_name === "rfx_content_submission") {
      apiUrl = `${apiBackendURL}rfx_content_submission/rfx_content_submission/all-rfx/tenant_id/${tenantID}`;
    } else if (table_name === "rfx_submission_mode") {
      apiUrl = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/all-rfx/tenant_id/${tenantID}`;
    } else if (table_name === "rfx_stage") {
      apiUrl = `${apiBackendURL}rfx_stage/rfx_stage/all-rfx/tenant_id/${tenantID}`;
    } else if (table_name === "bid_validity") {
      apiUrl = `${apiBackendURL}bid_validity/bid_validity/all-rfx/tenant_id/${tenantID}`;
    }

    const response = await fetch(apiUrl, {
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
        error: response.statusText || "Request failed for Rfx Prerequisite",
      };
    }
  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || "Request failed for Rfx Prerequisite",
    };
  }
};
