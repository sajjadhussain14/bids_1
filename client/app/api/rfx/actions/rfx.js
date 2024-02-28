'use server'
import getConfig from 'next/config'
import { formatFileSize } from '../../util/utility';

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





// get all Company records from db
export const getAllCompanyRecordsAction = async () => {
  try {
    const url = `${apiBackendURL}company/companies/tenant/${tenantID}`;

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
        error: response.statusText || "Request failed for Company",
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
      error: error.message || "Request failed for Company",
    };
  }
};


// get all Rfx stages records by type from db
export const getAllRfxStagesAction = async (typeName) => {
  try {
    const url = `${apiBackendURL}phase_stage/phase_stages/tenant/${tenantID}/type/${typeName}`;

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
        error: response.statusText || "Request failed for Rfx Stages",
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
      error: error.message || "Request failed for Rfx Stages",
    };
  }
};


// get all Rfx stages records by type & Rfx ID from db
export const getAllRfxStagesByRfxIdAction = async (rfx_id, typeName) => {
  try {
    const url = `${apiBackendURL}phase_stages_detail/phase_stages_detail/rfx/${rfx_id}/type/${typeName}`;

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
        error: response.statusText || "Request failed for Rfx Stages",
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
      error: error.message || "Request failed for Rfx Stages",
    };
  }
};


export const getRfxById = async (id) => {
    try {
        const url = `${apiBackendURL}rfx/rfx/id/${id}`;
    
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
            rfxData: [],
            error: response.statusText || 'Request failed for Rfxs',
          };
        }
    
        const result = await response.json();
    
        return {
          statusCode: 200,
          rfxData: result,
        };
    
      } catch (error) {
        console.log("eeeeeeeeeeeeeee",error)

        return {
          statusCode: "400",
          rfxData: [],
          error: error.message || 'Request failed for Rfxs',
        };
      }

}




export const getRfxTypes = async () => {
    try {
        const url = `${apiBackendURL}rfx_type/rfx_type/tenant/${tenantID}`;
    
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
            error: response.statusText || 'Request failed for Rfxs',
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
          error: error.message || 'Request failed for Rfxs',
        };
      }

}


export const getRfxStages = async () => {
    try {
        const url = `${apiBackendURL}rfx_stage/rfx_stage/tenant/${tenantID}`;
    
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
            error: response.statusText || 'Request failed for Rfxs',
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
          error: error.message || 'Request failed for Rfxs',
        };
      }

}




export const getBidVality = async () => {
    try {
        const url = `${apiBackendURL}bid_validity/bid_validity/tenant/${tenantID}`;
    
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
            error: response.statusText || 'Request failed for Rfxs',
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
          error: error.message || 'Request failed for Rfxs',
        };
      }

}



export const getSubmissionMode = async () => {
    try {
        const url = `${apiBackendURL}rfx_submission_mode/rfx_submission_mode/tenant/${tenantID}`;
    
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
            error: response.statusText || 'Request failed for Rfxs',
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
          error: error.message || 'Request failed for Rfxs',
        };
      }

}


export const getContentSubmission = async () => {
    try {
        const url = `${apiBackendURL}rfx_content_submission/rfx_content_submission/tenant/${tenantID}`;
    
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
            error: response.statusText || 'Request failed for Rfxs',
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
          error: error.message || 'Request failed for Rfxs',
        };
      }

}


export const getUsers = async () => {
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
          error: response.statusText || 'Request failed for Rfxs',
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
        error: error.message || 'Request failed for Rfxs',
      };
    }

}




export const getRfxContacts = async (id) => {
  try {
      const url = `${apiBackendURL}contacts/contacts/tenant/${tenantID}/rfx_id/${id}`;
  
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
          rfxData: [],
          error: response.statusText || 'Request failed for Rfxs',
        };
      }
  
      const result = await response.json();
  
      return {
        statusCode: 200,
        rfxData: result,
      };
  
    } catch (error) {
      console.log("eeeeeeeeeeeeeee",error)

      return {
        statusCode: "400",
        rfxData: [],
        error: error.message || 'Request failed for Rfxs',
      };
    }

}


export const getRfxContactsByKey = async (rfxID, contact_key) => {
  try {
      const url = `${apiBackendURL}contacts/contacts/tenant/${tenantID}/rfx_id/${rfxID}/key/${contact_key}`;
  
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
          rfxData: [],
          error: response.statusText || 'Request failed for Contacts',
        };
      }
  
      const result = await response.json();
  
      return {
        statusCode: 200,
        rfxData: result,
      };
  
    } catch (error) {

      return {
        statusCode: "400",
        rfxData: [],
        error: error.message || 'Request failed for Contacts',
      };
    }

}



export const createNewRfxAction = async (rfxData) => {

      const apiUrl = `${apiBackendURL}rfx/rfx`;

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
          "tenant_id": tenantID,
          "opportunity_id": rfxData.opportunity_id,
          "initiator_id": rfxData.initiator_id,
          "rfx_bid_assignto": 0,
          "rfx_title": rfxData.rfx_title,
          "rfx_number": rfxData.rfx_number,
          "under_existing_agreement": rfxData.under_existing_agreement,
          "status": "initiated",
          "previous_rfx_ref_num": rfxData.previous_rfx_ref_num,
          "revision_of_previous_rfx": rfxData.revision_of_previous_rfx,
          "agreement_ref_num": rfxData.agreement_ref_num,
          "issued_date": rfxData.issued_date ?? formatedDate,
          "due_date": rfxData.due_date,
          "crm_id": rfxData.crm_id,
          "bid_number": rfxData.bid_number,
          "request_for_bid": rfxData.request_for_bid,
          "submission_instructions": '',
          "visit_worksite": rfxData.visit_worksite,
          "visit_worksite_instructions": rfxData.visit_worksite_instructions,
          "tech_clarification_deadline": rfxData.tech_clarification_deadline,
          "com_clarification_deadline": rfxData.com_clarification_deadline,
          "expected_award_date": rfxData.expected_award_date,
          "enduser_id": 0,
          "enduser_type": rfxData.enduser_type,
          "acknowledged_by": rfxData.acknowledged_by,
          "acknowledgement_date": '2024-01-30',
          "acknowledgement_comment": rfxData.acknowledgement_comment,
          "acknowledged": rfxData.acknowledged,
          "acknowledgement_document": rfxData.acknowledgement_document ?? formatedDate,
          "acknowledgement_submitted_on": "2024-01-30T00:04:40.671Z",
          "rfx_type_id": rfxData.rfx_type_id,
          "bid_validity_id": rfxData.bid_validity_id,
          "rfx_content_submission_id": 1,
          "rfx_submission_mode_id": rfxData.rfx_submission_mode_id,
          "rfx_stage_id": rfxData.rfx_stage_id        
        })
      };
        
      try {
        const response = await fetch(apiUrl, requestOptions);
    
        if (!response.ok) {
          return {
            statusCode: "400",
            returnData: [],
            error: response.statusText || 'Request Failed for Rfx',
          };
        }
    
        const result = await response.json();

        // set rfx number
        let resp = updateRfxNumberAction(result.rfx_id, result.rfx_id)

        // save info of attached docs
        let resp1 = {}
        rfxData.attached_documents && rfxData.attached_documents.map((item, index) => (
           resp1 = createDocUploadAction(result.rfx_id, rfxData.initiator_id, item)          
        ))

        // save key contacts info
        let resp2 = {}
        rfxData.key_contacts && rfxData.key_contacts.map((item, index) => (
           resp2 = createContactsAction(result.rfx_id, item.user_id, item.contact_key)          
        ))

        // rfx stages detail
        let resp3 = await getAllRfxStagesAction('rfx stage')
        let rfxStagesList = resp3.returnData;
        rfxStagesList && rfxStagesList.map((item, index) => {   
          let status = (item.display_order == 1 ? 'done' : (item.display_order == 2 ? 'current' : 'pending'))
          let score = item.score        
          let resp3 = createStagesDetailAction(item.bidding_phases_id, result.rfx_id, status, score)          
        })

        // bid stages detail
        let resp4 = await getAllRfxStagesAction('bid stage')
        let bidStagesList = resp4.returnData;
        bidStagesList && bidStagesList.map((item, index) => {   
          let status = (item.display_order == 1 ? 'done' : (item.display_order == 2 ? 'current' : 'pending'))
          let score = item.score       
          let resp4 = createStagesDetailAction(item.bidding_phases_id, result.rfx_id, status, score)          
        })
                
        return {
          statusCode: 200,
          returnData: result,
        };
    
      } catch (error) {
        return {
          statusCode: "400",
          returnData: [],
          error: error.message || 'Request failed for Rfx',
        };
      }
}



export const updateRfxAction = async (rfxData, rfx_id) => {

  const apiUrl = `${apiBackendURL}rfx/rfx/id/${rfx_id}`;

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
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      "rfx_bid_assignto": rfxData.rfx_bid_assignto,
      "rfx_title": rfxData.rfx_title,
      "rfx_number": rfxData.rfx_number,
      "under_existing_agreement": rfxData.under_existing_agreement,
      "status": "initiated",
      "previous_rfx_ref_num": rfxData.previous_rfx_ref_num,
      "revision_of_previous_rfx": rfxData.revision_of_previous_rfx,
      "agreement_ref_num": rfxData.agreement_ref_num,
      "issued_date": rfxData.issued_date ?? formatedDate,
      "due_date": rfxData.due_date,
      "crm_id": rfxData.crm_id,
      "bid_number": rfxData.bid_number,
      "request_for_bid": rfxData.request_for_bid,
      "submission_instructions": '',
      "visit_worksite": rfxData.visit_worksite,
      "visit_worksite_instructions": rfxData.visit_worksite_instructions,
      "tech_clarification_deadline": rfxData.tech_clarification_deadline,
      "com_clarification_deadline": rfxData.com_clarification_deadline,
      "expected_award_date": rfxData.expected_award_date,
      "enduser_id": rfxData.enduser_id,
      "enduser_type": rfxData.enduser_type,
      "rfx_type_id": rfxData.rfx_type_id,
      "bid_validity_id": rfxData.bid_validity_id,
      "rfx_content_submission_id": rfxData.rfx_content_submission_id,
      "rfx_submission_mode_id": rfxData.rfx_submission_mode_id,
      "rfx_stage_id": rfxData.rfx_stage_id,
      "acknowledged_by": rfxData.acknowledged_by,
      "acknowledgement_date": '2024-01-30',
      "acknowledgement_comment": rfxData.acknowledgement_comment,
      "acknowledged": rfxData.acknowledged,
      "acknowledgement_document": rfxData.acknowledgement_document,
      "acknowledgement_submitted_on": "2024-01-30T00:04:40.671Z",
      "rfx_id": rfx_id          
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Rfx',
      };
    }

    const result = await response.json();

    // save ino of attached docs
    let resp = {}
    rfxData.attached_documents && rfxData.attached_documents.map((item, index) => (
       resp = createDocUploadAction(rfx_id, 1, item)      
    ))

    // save key contacts info
    let resp2 = {}
    rfxData.key_contacts && rfxData.key_contacts.map((item, index) => (
       resp2 = createContactsAction(rfx_id, item.user_id, item.contact_key)          
    ))

    return {
      statusCode: 200,
      returnData: result,
    };

  } catch (error) {
    return {
      statusCode: "400",
      returnData: [],
      error: error.message || 'Request failed for Rfx',
    };
  }
}



export const updateRfxNumberAction = async (rfx_id, rfx_number) => {
  const apiUrl = `${apiBackendURL}rfx/rfx/rfx-number/id/${rfx_id}`;

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
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      "rfx_number": String(rfx_number)
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: {status: true},
        error: response.statusText || 'Request Failed for Rfx Number',
      };
    }

    const result = await response.json();

   
    return {
      statusCode: 200,
      returnData: {status: result},
    };

  } catch (error) {
    return {
      statusCode: "400",
      returnData: {status: false},
      error: error.message || 'Request failed for Rfx',
    };
  }
}


export const updateBidNumberAction = async (rfx_id, bid_number) => {
  const apiUrl = `${apiBackendURL}rfx/rfx/bid-number/id/${rfx_id}`;
  
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
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      "bid_number": String(bid_number)
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: {status: true},
        error: response.statusText || 'Request Failed for Bid Number',
      };
    }

    const result = await response.json();

   
    return {
      statusCode: 200,
      returnData: {status: result},
    };

  } catch (error) {
    return {
      statusCode: "400",
      returnData: {status: false},
      error: error.message || 'Request failed for Bid Number',
    };
  }
}


export const updateBidAssignToAction = async (rfx_id, rfx_bid_assignto) => {
  const apiUrl = `${apiBackendURL}rfx/rfx/rfx-bid-assignto/id/${rfx_id}`;

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
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      "rfx_bid_assignto": rfx_bid_assignto
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: {status: true},
        error: response.statusText || 'Request Failed for Bid Number',
      };
    }

    const result = await response.json();

   
    return {
      statusCode: 200,
      returnData: {status: result},
    };

  } catch (error) {
    return {
      statusCode: "400",
      returnData: {status: false},
      error: error.message || 'Request failed for Bid Number',
    };
  }
}



export const GetRfxDocumentsAction = async (rfx_id) => {
  const apiUrl = `${apiBackendURL}docvalt/docvalt/tenant/${tenantID}/rfx_id/${rfx_id}`;

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
    method: 'GET',
    headers: headers,    
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Docvalt',
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
      error: error.message || 'Request failed for Docvalt',
    };
  }
}


export const GetRfxDocumentsBy_RfxID_Key_Action = async (rfx_id, docvalt_key) => {
  const apiUrl = `${apiBackendURL}docvalt/docvalt/rfx/${rfx_id}/key/${docvalt_key}`;

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
    method: 'GET',
    headers: headers,    
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Docvalt',
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
      error: error.message || 'Request failed for Docvalt',
    };
  }
}


export const createDocUploadAction = async (rfx_id, user_id, docData, docvalt_key='rfx') => {
  const apiUrl = `${apiBackendURL}docvalt/docvalt`;

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
      "tenant_id": tenantID,
      "rfx_id": rfx_id,
      "user_id": user_id,
      "docvalt_key": docvalt_key,
      "docvalt_dir": "",
      "docvalt_filename": docData.name,
      "docvalt_cloudpath": "",
      "file_type": (docData.type || '').split('/')[1],
      "file_size": formatFileSize(parseInt(docData.size)),
      "file_moved": false,
      "created_date": formatedDate,
      "created_at": formattedTimestamp,
      "updated_at": formattedTimestamp
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Docvalt',
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
      error: error.message || 'Request failed for Docvalt',
    };
  }
}



export const createStagesDetailAction = async (bidding_phases_id, rfx_id, stage_status, stage_score) => {
  const apiUrl = `${apiBackendURL}phase_stages_detail/phase_stages_detail`;

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
      "bidding_phases_id": bidding_phases_id,
      "rfx_id": rfx_id,
      "stage_status": stage_status,
      "stage_score": stage_score,
      "completed": false,
      "created_at": formattedTimestamp,
      "updated_at": formattedTimestamp
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Stages Detail',
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
      error: error.message || 'Request failed for Stages Detail',
    };
  }
}



export const createContactsAction = async (rfx_id, user_id, contact_key) => {
  const apiUrl = `${apiBackendURL}contacts/contacts`;

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
      "tenant_id": tenantID,
      "rfx_id": rfx_id,
      "contact_user_id": user_id,
      "conatct_key": contact_key,
      "created_date": formatedDate,
      "created_at": formattedTimestamp
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Contacts',
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
      error: error.message || 'Request failed for Contacts',
    };
  }

}



export const updateAcknowledgementAction = async (rfxID, acknowledgementNotes, acknowledgementDate) => {
  const apiUrl = `${apiBackendURL}rfx/rfx/acknowledgement/rfx-id/${rfxID}`;

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
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({
      "rfx_acknowledgement": 0,
      "rfx_id": rfxID,
      "acknowledged_by": 1,
      "acknowledgement_date": acknowledgementDate,
      "acknowledgement_comment": acknowledgementNotes,
      "acknowledged": true,
      "acknowledgement_document": 0,
      "acknowledgement_submitted_on": formattedTimestamp
    })
  };
    
  try {
    const response = await fetch(apiUrl, requestOptions);

    if (!response.ok) {
      return {
        statusCode: "400",
        returnData: [],
        error: response.statusText || 'Request Failed for Contacts',
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
      error: error.message || 'Request failed for Contacts',
    };
  }

}