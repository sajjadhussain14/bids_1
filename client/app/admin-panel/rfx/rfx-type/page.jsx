import { getAllRfxPrereqRecordsAction } from "@/app/api/admin-panel/actions/rfx";
import getConfig from "next/config";
import Breadcrumbs from "@/app/controlpanel/components/Breadcrumbs";
import Link from "next/link";
import RfxPrereqAddNewButton from "../components/RfxPrereqAddNewButton";
import RfxPrereqListingButtons from "../components/RfxPrereqListingButtons";
import DeleteAllRFxTypeButton from "../components/DeleteAllRFxTypeButton";

export default async function AdminPanelDesignation() {
  const { serverRuntimeConfig } = getConfig() || {};

  // call all tenant action
  let records = await getAllRfxPrereqRecordsAction("rfx_type");
  let allRecords = records.returnData;

  const breadcrumbItems = [
    { label: "Home", href: "/admin-panel" },
    { label: "Rfx Type", href: "/admin-panel/rfx/rfx-type" },
  ];

  return (
    <div className=" w-full">
      <div className="flex w-full justify-between mb-2">
        <Breadcrumbs items={breadcrumbItems} />
        <RfxPrereqAddNewButton buttonName={"rfx_type"} buttonType={"new"} />
      </div>

      <div class="card">
        <div className="flex justify-between ">
          <div className=" ">
            <h5 class="card-header">Rfx Type List</h5>
          </div>
          <div className="mt-3 mr-2 ">{<DeleteAllRFxTypeButton />}</div>
        </div>
        <div class="table-responsive text-nowrap">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Alias</th>
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
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td>{item.alias}</td>
                    <td>
                      <RfxPrereqListingButtons
                        propsData={item}
                        tablename={"rfx_type"}
                        id={item.rfx_type_id}
                      />
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
