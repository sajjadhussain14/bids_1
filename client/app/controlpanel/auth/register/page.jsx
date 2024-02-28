import Breadcrumbs from "@/components/controlpanel/Breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import RegisterTenantForm from "@/components/controlpanel/RegisterForm";
import getConfig from 'next/config'

export default async function NewTenant()  {

  const { serverRuntimeConfig } = getConfig() || {};
  let accessToken = ''
  let apiBackendURL = ''
  let tenantID = 0
  // get server side global store data
  if (serverRuntimeConfig) {
    // get api backend url
    apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER
    // get access token
    accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER
    tenantID = serverRuntimeConfig.TENANT_ID
  }

  const breadcrumbItems = [
    { label: "Control Penal", href: "/controlpanel/auth/members" },
    { label: "Register Tenant", href: "/controlpanel/auth/register" },   
  ];

  

  return (
      <div className=" w-full">  
        <div className="flex w-full">
          <Breadcrumbs items={breadcrumbItems}/>        
        </div>   
        <RegisterTenantForm apiBackendURL={apiBackendURL} accessToken={accessToken} />       
      </div>
  );
};

