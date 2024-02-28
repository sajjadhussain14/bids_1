import { getAllTeamRecordsAction } from "@/app/api/admin-panel/actions/user";
import getConfig from "next/config";
import Breadcrumbs from "@/app/controlpanel/components/Breadcrumbs";
import Link from "next/link";
import AddNewButton from "../components/AddNewButton";
import TeamListingButtons from "../components/TeamListingButtons";
import DeleteAllTeamsButton from "../components/DeleteAllTeamsButton";

export default async function AdminPanelTeam() {
  const { serverRuntimeConfig } = getConfig() || {};

  // call all tenant action
  let records = await getAllTeamRecordsAction();
  let allRecords = records.returnData;

  const breadcrumbItems = [
    { label: "Home", href: "/admin-panel" },
    { label: "Teams", href: "/admin-panel/teams" },
  ];

  return (
    <div className=" w-full">
      <div className="flex w-full justify-between mb-2">
        <Breadcrumbs items={breadcrumbItems} />
        <AddNewButton buttonName={"team"} buttonType={"new"} />
      </div>

      <div class="card">
        <div className="flex justify-between ">
          <div className=" ">
            <h5 class="card-header">Teams List</h5>
          </div>
          <div className="mt-3 mr-2 ">
            <DeleteAllTeamsButton />
          </div>
        </div>
        <div class="table-responsive text-nowrap">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Title</th>
                <th>Role</th>
                <th>Role Level</th>
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
                            {item.team_title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{item.team_role}</td>
                    <td>Team Level is ({item.role_level})</td>
                    <td>
                      <TeamListingButtons propsData={item} />
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
