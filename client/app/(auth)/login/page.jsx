import { checkValidTenant, getTenantUrl } from "@/app/api/util/script";
import LoginForm from "@/components/LoginForm";
import "./login.css";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import InvalidTenant from "@/components/InvalidTenant";
import getConfig from 'next/config'
import { redirect } from 'next/navigation'

const Login = async () => {
  let apiBackendURL = "";
  let isLogin=false

  const { serverRuntimeConfig, publicRuntimeConfig,env } = getConfig() || {};
  if (serverRuntimeConfig) {
    apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER;
    isLogin = serverRuntimeConfig.IS_LOGIN

  }




  const headersList = headers();
  const referer = headersList.get("x-forwarded-host");
  let currentURL = "";

  if (referer) {
    const request = new NextRequest(referer);
    currentURL = request.nextUrl.href;
  }
  let tenantDomain = getTenantUrl(currentURL);
  const res = await checkValidTenant(apiBackendURL, tenantDomain);
  let tenantStatus = false;
  let tenantStatusMsg = "";
  if (res.statusCode == 200) {
    let tenant = res.responseData;
    tenantStatus = true;

    if (!tenant.email_verified) {
      tenantStatus = false;
      tenantStatusMsg = "Tenant Email is not Verified ";
    }
    if (!tenant.tenant_is_active) {
      tenantStatus = false;
      tenantStatusMsg = "Tenant Email is not Active ";
    }
    if (tenant.tenant_is_suspended) {
      tenantStatus = false;
      tenantStatusMsg = "Tenant Email is Suspended ";
    }

    if (serverRuntimeConfig) {
      if (tenantStatus == true)
        serverRuntimeConfig.TENANT_ID = tenant.tenant_id;
      else serverRuntimeConfig.TENANT_ID = 0;
    }


    if (publicRuntimeConfig) {
      publicRuntimeConfig.TENANT_ID = tenant.tenant_id
    }

    if (env) {
      env.TENANT_ID = tenant.tenant_id
    }

  


  } else {
    tenantStatus = false;
    tenantStatusMsg = "No Tenant Found";
  }


  if(isLogin) redirect("/dashboard")


  return tenantStatus ? (
    <LoginForm tenantID={serverRuntimeConfig.TENANT_ID} />
  ) : (
    <InvalidTenant msg={tenantStatusMsg} />
  );
};

export default Login;
