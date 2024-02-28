import Breadcrumbs from "@/components/Breadcrumbs";
import SearchTable from "@/components/SearchTable";
import { IoIosSearch } from "react-icons/io";
import getConfig from 'next/config'
import { getAllOppotunitiesRecords } from "@/app/api/opportunities/scripts";

const Opportunitues = async () => {
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
  // call all  request
  let records = await getAllOppotunitiesRecords(apiBackendURL, accessToken, tenantID)
  let opportunitiesRecords = records.rfxData;

   const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "New Rfx", href: "/rfx/new" },
    { label: "Opportunities", href: "#", inactiveClass:"text-black cursor-default"  },
     
  ];
  const handleRowClick = (params) => {
    const rowId = params.row.id;
      router.push(`/opportunities/add/${rowId}`);

  };

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="w-[260px] flex items-center justify-between rounded-2xl bg-white py-[6px] px-5 my-4 ml-auto">
        <input
          type="text"
          placeholder="Search within results"
          className="w-full text-black bg-transparent border-0 outline-none placeholder:text-[#778CA2] placeholder:text-sm"
        />
        <button>
          <IoIosSearch className="transform scale-x-[-1] text-[#778CA2]" />
        </button>
      </div>
        <SearchTable rows={opportunitiesRecords} />
    </div>
  );
};

export default Opportunitues;
