import { getOpportunityByID } from "@/app/api/opportunities/scripts";
import { getAllRfxStagesByRfxIdAction, getRfxContacts } from "@/app/api/rfx/actions/rfx";
import { getRfxById } from "@/app/api/rfx/actions/rfx";
import { getUserById, getAllUsers } from "@/app/api/rfx/actions/user";
import { getAllRfxClarificationRecordsBy_RfxID_Action } from "@/app/api/manager/actions/clarifications";
import RfxDetail from "@/components/RfxDetail"
import { getAllSubmissionAction } from "@/app/api/manager/actions/bidsubmission";
import { getAllBidClarificationRecordsBy_RfxID_Action } from "@/app/api/manager/actions/bidclarifications";

import getConfig from 'next/config'

const Detail = async ({ params }) => {
    const { id } = params

    const { serverRuntimeConfig } = getConfig() || {};
    let accessToken = ''
    let apiBackendURL = ''
    let tenantID = 0
    let loginUserRec = {}
    // get server side global store data
    if (serverRuntimeConfig) {
        // get api backend url
        apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER
        // get access token
        accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER
        tenantID = serverRuntimeConfig.TENANT_ID
        // get login user obj
        loginUserRec = serverRuntimeConfig.LOGIN_USER_DATA
    }
    // call all  opportunity
    let records = await getOpportunityByID(apiBackendURL, accessToken, tenantID, id)
    let opportunirtRec = records.rfxData;

    // call current Rfx
    records = await getRfxById(id)
    let rfxRec = records.rfxData;
    
    records = await getAllRfxStagesByRfxIdAction(id, 'rfx stage')
    let stagesRec = records.returnData;
    
    records = await getRfxContacts(id);
    let  contactsRec = records.rfxData
    
    let  keyContactsRec = []  
    for (const item of contactsRec) {
        try {
            const apiData = await getUserById(item.contact_user_id);
            const updatedObject = {...apiData.data, contact_key: item.conatct_key};
            keyContactsRec.push(updatedObject);
        } catch (error) {
            console.error(`Error fetching data for object with id ${item.contact_user_id}`, error);
        }
    }

    
    let assigntoRec = {}
    if(rfxRec.rfx_bid_assignto > 0) {
        records = await getUserById(rfxRec.rfx_bid_assignto);
        assigntoRec = records.data;
    }
    
    let initiatorRec = {}
    if(rfxRec.initiator_id > 0) {
        records = await getUserById(rfxRec.initiator_id);
        initiatorRec = records.data;
    }
   
    records = await getAllUsers();
    let allUsersRec = records.data

    records = await getAllRfxClarificationRecordsBy_RfxID_Action(rfxRec.rfx_id);
    let clarificationRec = records.returnData 

    records = await getAllSubmissionAction(rfxRec.rfx_id);
    let submissionRec = records.returnData

    records = await getAllBidClarificationRecordsBy_RfxID_Action(rfxRec.rfx_id)
    const bidClarifRec = records.returnData

    return (
        <div>
            <RfxDetail login_user_id={loginUserRec.user_id} data={opportunirtRec} rfxRecord={rfxRec} stagesList={stagesRec} tenantID={tenantID} apiBackendURL={apiBackendURL} keyContactsRec={keyContactsRec} assigntoRec={assigntoRec} initiatorRec={initiatorRec} allUsersRec={allUsersRec} clarificationRec={clarificationRec} submissionRec={submissionRec} bidClarifRec={bidClarifRec}/>
        </div>
    )
}

export default Detail