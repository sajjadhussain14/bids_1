import { getAllDesignationRecordsAction } from "@/app/api/admin-panel/actions/user";
import getConfig from "next/config";
import Breadcrumbs from "@/app/controlpanel/components/Breadcrumbs";
import Link from "next/link";
import AddNewButton from "../components/AddNewButton";
import DesignationListingButtons from "../components/DesignationListingButtons";
import DeleteAllDesignationButton from "../components/DeleteAllDesignationButton";

export default async function AdminPanelDesignation() {
  const { serverRuntimeConfig } = getConfig() || {};

  // call all tenant action
  let records = await getAllDesignationRecordsAction();
  let allRecords = records.returnData;

  const breadcrumbItems = [
    { label: "Home", href: "/admin-panel" },
    { label: "Designation", href: "/admin-panel/designation" },
  ];

  return (
    <div className=" w-full">
      <div className="flex w-full justify-between mb-2">
        <Breadcrumbs items={breadcrumbItems} />
        <AddNewButton buttonName={"designation"} buttonType={"new"} />
      </div>

      <div class="card">
        <div className="flex justify-between ">
          <div className=" ">
            <h5 class="card-header">Designation List</h5>
          </div>
          <div className="mt-3 mr-2 ">
            <DeleteAllDesignationButton />
          </div>
        </div>
        <div class="table-responsive text-nowrap">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              {allRecords &&
                allRecords.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div class="flex items-center">
                        <div class="form-check ">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck3"
                            checked=""
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div class="font-normal text-secondary">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{item.type}</td>
                    <td>{item.description}</td>
                    <td>
                      {["Bid Manager","Sales Representative"].includes(item.title) ?  '' : <DesignationListingButtons propsData={item} /> }
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
