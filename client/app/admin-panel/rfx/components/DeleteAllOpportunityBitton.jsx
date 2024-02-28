"use client";
import { useState } from "react";
import {
  getAllOpportunityRecordsAction,
  deleteAllOpportunityRecordAction,
} from "@/app/api/admin-panel/actions/opportunity";

const DeleteAllOpportunityButton = ({ onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClickDeleteOpportunity = async () => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete Opportunity? This will delete Opportunity's all data."
    );

    if (confirmDelete) {
      let resp = await getAllOpportunityRecordsAction();
      let getOpport = resp.returnData;
      //console.log(getOpport);

      for (const item of getOpport) {
        let resp = deleteAllOpportunityRecordAction(item.opportunity_id);
      }
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <button
      onClick={handleClickDeleteOpportunity}
      type="button"
      class="btn btn-sm btn-outline-secondary waves-effect justify-between"
    >
      <span class="tf-icons mdi mdi-trash-can-outline me-1"></span>
      Delete All Opportunity
    </button>
  );
};

export default DeleteAllOpportunityButton;
