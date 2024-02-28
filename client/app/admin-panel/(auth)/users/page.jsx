import { getAllUserRecordsAction } from "@/app/api/admin-panel/actions/user";
import getConfig from "next/config";
import Breadcrumbs from "@/app/controlpanel/components/Breadcrumbs";
import UserListingButtons from "../../components/UserListingButtons";
import Link from "next/link";
import ListHeadElementsUsers from "./components/ListHeadElements";
import DeleteAllUsersButton from "./components/DeleteAllUsersButton";

export default async function AdminPanelUsers() {
  const { serverRuntimeConfig } = getConfig() || {};

  const actionData = [
    { value: "Active", selected: false },
    { value: "Inactive", selected: false },
    { value: "Delete", selected: false },
  ];

  let accessToken = "";
  let apiBackendURL = "";
  let tenantID = 0;
  // get server side global store data
  if (serverRuntimeConfig) {
    // get api backend url
    apiBackendURL = serverRuntimeConfig.API_BACKEND_SERVER;
    // get access token
    accessToken = serverRuntimeConfig.API_ACCESS_TOKEN_SERVER;
    tenantID = serverRuntimeConfig.TENANT_ID;
  }

  // call all tenant action
  let records = await getAllUserRecordsAction();
  let usersData = records.returnData;

  const breadcrumbItems = [
    { label: "Home", href: "/admin-panel" },
    { label: "Users", href: "/admin-panel/users" },
  ];

  return (
    <div className=" w-full">
      <div className="flex w-full justify-between mb-2">
        <Breadcrumbs items={breadcrumbItems} />
        <Link
          href={"/admin-panel/users/register"}
          type="button"
          className="btn btn-sm btn-secondary waves-effect justify-between"
        >
          <span className="tf-icons mdi mdi-plus me-1"></span>New User
        </Link>
      </div>

      <div className="card">
        <div className="flex justify-between ">
          <div className=" ">
            <h5 className="card-header">Users List</h5>
          </div>
          <div className="mt-3 mr-2 ">
            <DeleteAllUsersButton />
          </div>
        </div>
        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Last Login At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {usersData &&
                usersData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex">
                        <div className="form-check ">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck3"
                            checked=""
                          />
                        </div>
                        <div>
                          <div className="text-base text-black ">
                            <Link
                              href={"/admin-panel/users"}
                              className="text-secondary"
                            >
                              {item.first_name + " " + item.last_name}
                            </Link>
                          </div>
                          <div className="font-normal text-secondary">
                            Designation
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a
                        className="text-secondary"
                        href={"mailto:" + item.email}
                      >
                        {item.email}
                      </a>
                    </td>
                    <td>{new Date(item.last_login_at).toLocaleString()}</td>
                    <td>
                      {item.active && item.verified && (
                        <span className="badge text-success">Active</span>
                      )}
                      {!item.active && item.verified && (
                        <span className="badge text-secondary">Inactive</span>
                      )}
                      {!item.verified && (
                        <span className="badge text-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      <UserListingButtons
                        apiBackendURL={apiBackendURL}
                        accessToken={accessToken}
                        tenantID={tenantID}
                        user_id={item.user_id}
                        userDetail={item}
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
