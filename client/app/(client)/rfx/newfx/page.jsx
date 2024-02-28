import { getBidVality, getContentSubmission, getRfxStages, getRfxTypes, getSubmissionMode, getUsers, getAllCompanyRecordsAction } from "@/app/api/rfx/actions/rfx";
import CreateNewRfx from "@/components/CreateNewRfx";
import { getUserById } from "@/app/api/rfx/actions/user";

import getConfig from 'next/config'
const NewFx = async () => {
  let preRfxData = {}
  const { serverRuntimeConfig } = getConfig() || {};
   

  let accessToken = ''
  let apiBackendURL = ''
  let tenantID = 0
  let loginUserID = 0
  // get server side global store data
  if (serverRuntimeConfig) {
    // get api backend url
    apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER
    // get access token
    accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER
    tenantID = serverRuntimeConfig.TENANT_ID
    loginUserID = serverRuntimeConfig.LOGIN_USER_DATA.user_id
  }


  if (serverRuntimeConfig) {
    if (Object.entries(serverRuntimeConfig.TEMP_DATA).length > 0) {
      preRfxData = { ...serverRuntimeConfig.TEMP_DATA }
    }
  }

  let rfxTypesRes= await getRfxTypes();
  const rfxType = rfxTypesRes.data


  let rfxStagesRes= await getRfxStages();
  const rfxStages = rfxStagesRes.data

  let bidValidityRes= await getBidVality();
  const bidValidity = bidValidityRes.data


  let submissionModeRes= await getSubmissionMode();
  const submissionMode = submissionModeRes.data

  let contentSubmissionRes= await getContentSubmission();
  const contentSubmission = contentSubmissionRes.data
  
  let usersRes= await getUsers();
  const users = usersRes.data

  let companyRes = await getAllCompanyRecordsAction();
  const companyList = companyRes.returnData

   return (
    <CreateNewRfx preRfxData={preRfxData}  rfxType={rfxType} rfxStages={rfxStages} bidValidity={bidValidity} submissionMode={submissionMode} contentSubmission={contentSubmission} users={users} companies={companyList}  apiBackendURL={apiBackendURL} tenantID={tenantID}  loginUserID={loginUserID} />
  );
};

export default NewFx;
