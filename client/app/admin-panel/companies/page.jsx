import { getAllCompanyRecordsAction } from "@/app/api/admin-panel/actions/user";
import getConfig from "next/config";
import Breadcrumbs from "@/app/controlpanel/components/Breadcrumbs";
import Link from "next/link";
import CompanyListingButtons from "../components/CompanyListingButtons";
import AddNewButton from "../components/AddNewButton";
import Image from "next/image";
import DeleteAllCompaniesButton from "../components/DeleteAllCompaniesButton";

export default async function AdminPanelCompanies() {
  const { serverRuntimeConfig } = getConfig() || {};

  // call all tenant action
  let records = await getAllCompanyRecordsAction();
  let usersData = records.returnData;

  const breadcrumbItems = [
    { label: "Home", href: "/admin-panel" },
    { label: "Companies", href: "/admin-panel/companies" },
  ];

  return (
    <div className=" w-full">
      <div className="flex w-full justify-between mb-2">
        <Breadcrumbs items={breadcrumbItems} />
        <AddNewButton buttonName={"company"} buttonType={"new"} />
      </div>

      <div class="card">
        <div className="flex justify-between ">
          <div className=" ">
            <h5 class="card-header">Companies List</h5>
          </div>
          <div className="mt-3 mr-2 ">
            <DeleteAllCompaniesButton />
          </div>
        </div>
        <div class="table-responsive text-nowrap">
          <table class="table">
            <thead class="table-light">
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Industry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              {usersData &&
                usersData.map((item, index) => (
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
                          <div class="text-base text-black ">
                            {
                              <Image
                                src="/assets/img/icons/brands/asana.png"
                                alt="brand"
                                className="mr-2"
                                width={40}
                                height={40}
                              />
                            }
                          </div>
                          <div class="font-normal text-secondary">
                            {item.company_name}
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
                    <td>{item.phone}</td>
                    <td>{item.industry}</td>
                    <td>
                      <CompanyListingButtons propsData={item} />
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
