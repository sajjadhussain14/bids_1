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



export const getAllRfxClarificationRecordsBy_RfxID_Action = async (rfxID) => {
    try {
      const url = `${apiBackendURL}rfx_clarification/rfx-clarifications/rfx/${rfxID}`;
  
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
          error: response.statusText || "Request failed for Rfx Clarificaton",
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
        error: error.message || "Request failed for Rfx Clarificaton",
      };
    }
  };

  
  export const getAllRfxClarificationPostRecordsBy_ClarifId_Action = async (clarif_id) => {
    try {
      const url = `${apiBackendURL}rfx_clarification_post/rfx_clarification_posts/clarification/${clarif_id}`;
  
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
          error: response.statusText || "Request failed for Rfx Clarificaton Post",
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
        error: error.message || "Request failed for Rfx Clarificaton Post",
      };
    }
  };



  export const createRfxClarificationAction = async (rfxData) => {
    const apiUrl = `${apiBackendURL}rfx_clarification/rfx-clarifications/`;
  
    const now = new Date();
    const formattedTimestamp = now.toISOString()
    const formatedDate = now.toISOString().split('T')[0]
  
    const headers = new Headers({
      cache: 'no-store',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }); 
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "rfx_id": rfxData.rfx_id,
        "submitted_by": rfxData.submitted_by,
        "assign_to": rfxData.assign_to,
        "rfx_clarification_ref_num": rfxData.rfx_clarification_ref_num,
        "clarification_title": rfxData.clarification_title,
        "clarification_type": rfxData.clarification_type,
        "clarification_issued_date": rfxData.clarification_issued_date,
        "clarification_due_date": rfxData.clarification_due_date,
        "status": rfxData.status,
        "description": rfxData.description,
        "posted_on": formattedTimestamp
      })
    };
      
    try {
      const response = await fetch(apiUrl, requestOptions);
  
      if (!response.ok) {
        return {
          statusCode: "400",
          returnData: [],
          error: response.statusText || 'Request Failed for Rfx Clarification',
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
        error: error.message || 'Request failed for Rfx Clarification',
      };
    }
  }



  export const createRfxClarificationCommentAction = async (rfxData) => {
    const apiUrl = `${apiBackendURL}rfx_clarification_post/rfx-clarification-posts/`;
  
    const now = new Date();
    const formattedTimestamp = now.toISOString()
    const formatedDate = now.toISOString().split('T')[0]
  
    const headers = new Headers({
      cache: 'no-store',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }); 
    
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "rfx_clarification_id": rfxData.rfx_clarification_id,
        "posted_by": rfxData.posted_by,
        "post_number": rfxData.post_number,
        "posted_on": formattedTimestamp,
        "title": rfxData.title,
        "comment": rfxData.comment,
        "parent_id": rfxData.parent_id ? rfxData.parent_id : 0
      })
    };
      
    try {
      const response = await fetch(apiUrl, requestOptions);
  
      if (!response.ok) {
        return {
          statusCode: "400",
          returnData: [],
          error: response.statusText || 'Request Failed for Rfx Clarification',
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
        error: error.message || 'Request failed for Rfx Clarification',
      };
    }
  }
