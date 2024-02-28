'use client'
import React, { useState, useEffect } from 'react';
import UploadDialog from '@/components/UploadDailogue';
import Breadcrumbs from "@/components/Breadcrumbs"
import Image from "next/image";
import { FaArrowRight, FaRegCalendarMinus, FaBarsProgress, FaChevronLeft, FaCircleCheck, FaPersonHarassing } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { VscChecklist } from "react-icons/vsc";
import Link from "next/link";
import { LuRefreshCcw } from "react-icons/lu";
import BidDialog from '@/components/BidRequestDailogue';
import { IoIosSearch, IoMdAddCircleOutline } from "react-icons/io";
import SearchTable from '@/components/SearchTable';
import { FaRegFilePdf } from "react-icons/fa";
import DragDrop from '@/components/FileInput';
import { FaRegFileImage } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MenuItem, Stack, TextField } from '@mui/material';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import DynamicDatePicker from '@/components/DatePickerInput';
import PopupInput from '@/components/PopupInput';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { formatDatetime, formatDateString, generateUniqueSixDigitNumber } from '@/app/api/util/utility';
import { movetoNextStageAction } from '@/app/api/rfx/stages';
import { updateBidAssignToAction, updateBidNumberAction, getAllRfxStagesByRfxIdAction } from '@/app/api/rfx/actions/rfx';
import SearchTableNew from './SearchTableNew';
import { createDocUploadAction, GetRfxDocumentsBy_RfxID_Key_Action, GetRfxDocumentsAction } from '@/app/api/rfx/actions/rfx';
import { createRfxClarificationAction, getAllRfxClarificationRecordsBy_RfxID_Action, createRfxClarificationCommentAction, getAllRfxClarificationPostRecordsBy_ClarifId_Action } from '@/app/api/manager/actions/clarifications';
import { createReviewEntryAction, createReviewContactsAction, getAllReviewContactsBy_BidReviewID_Action, getAllReviewsRecordsBy_Rfx_Key_Action } from '@/app/api/manager/actions/reviews';
import { getUserById } from '@/app/api/rfx/actions/user';
import { getAllSubmissionAction, getSubmissionByIdAction, createSubmissionAction } from '@/app/api/manager/actions/bidsubmission';
import { createBidClarificationAction, createBidClarificationCommentAction, getAllBidClarificationPostRecordsBy_ClarifId_Action, getAllBidClarificationRecordsBy_RfxID_Action, getBidClarificationRecordsByIdAction } from '@/app/api/manager/actions/bidclarifications';
import { uploadFiles } from '@/app/api/util/utility';




const RfxDetail = ({ data, rfxRecord, stagesList, apiBackendURL, login_user_id, tenantID, keyContactsRec, assigntoRec, initiatorRec, allUsersRec, clarificationRec, submissionRec, bidClarifRec }) => {
    console.log(submissionRec)
    const [open, setOpen] = useState(false);
    const [openRequestDailog, setOpenRequestDailog] = useState(false);
    const [DailogtextValue, setDailogTextValue] = useState('');
    const [openBid, setOpenBid] = useState(false);
    const [openContactAssign, setOpenContactAssign,] = useState(false);
    const [active, setActive] = useState('');
    const [messages, setMessages] = useState([]);
    const [messagesBidClar, setMessagesBidClar] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [clarificationDetail, setClarificationDetail] = useState(false)
    const [documentDetail, setDocumentDetail] = useState(false)
    const [bidDetail, setBidDetail] = useState(false)
    const [bidDetailInfo, setBidDetailInfo] = useState(false)
    const [bidTable, setBidTable] = useState(true)
    const [showReply, setShowReply] = useState(false)
    const [showBidClarReply, setShowBidClarReply] = useState(false)
    const [nextStep, setNextStep] = useState(false)
    const [avtiveBidRequestBtn, setActiveBidRequestBtn] = useState(rfxRecord.acknowledged)
    //const [avtiveBidRequestBtn, setActiveBidRequestBtn] = useState(false)
    const [hideDocBtn, setHideDocSubmitBtn] = useState(false)
    const [docDailog, setDocDailog] = useState(false)
    const [showDocTable, setShowDocTable] = useState(true)
    const [personAssignTo, setPersonAssignTo] = useState(
        assigntoRec && {
            id: assigntoRec.user_id,
            name: `${assigntoRec.first_name} ${assigntoRec.last_name}`,
            designation: assigntoRec.designation_title
        })
    const [personInitiator, setPersonInitiator] = useState(
        initiatorRec && {
            id: initiatorRec.user_id,
            name: `${initiatorRec.first_name} ${initiatorRec.last_name}`,
            designation: initiatorRec.designation_title
        })
    const [bidNumber, setBidNumber] = useState(rfxRecord.bid_number)
    const [acknowledgementDate, setAcknowledgementDate] = useState(rfxRecord.acknowledgement_submitted_on)
    const [acknowledgementComment, setAcknowledgementComment] = useState(rfxRecord.acknowledgement_comment)
    const [replyMessage, setReplyMessage] = useState('');
    const [replyMessageBidClar, setReplyMessageBidClar] = useState('');

    const [showSubmitedRfxCalrification, setShowSubmitedRfxCalrification] = useState(false);
    const [attachedDocuments, setAttachedDocuments] = useState()

    const [overviewData, setoverviewData] = useState([
        { name: 'RFx ID', value: rfxRecord.rfx_number ? rfxRecord.rfx_number : 'Not Assigned' },
        { name: 'BID ID', value: bidNumber ? bidNumber : 'Not Assigned' },

        { name: 'CRM ID', value: rfxRecord.crm_id ?? '' },
        { name: 'Opportunity Title', value: rfxRecord.rfx_title ?? '' },

        { name: 'Customer', value: rfxRecord.customer_name ?? '' },
        { name: 'Stage', value: rfxRecord.opportunity_stage ?? '' },

        { name: 'End User', value: rfxRecord.company_name ?? '' },
        { name: 'Opportunity Type', value: rfxRecord.opportunity_type ?? '' },

        { name: 'Region', value: rfxRecord.region ?? '' },
        { name: 'Industry Code', value: rfxRecord.industry_code ?? '' },

        { name: 'Business Unit', value: rfxRecord.business_unit ?? '' },
        { name: 'Project Type', value: rfxRecord.project_type ?? '' },

        { name: 'Competition', value: rfxRecord.project_type ?? '' },
        { name: 'Total Opportunity Value ($)', value: '$' + rfxRecord.competition ?? '$0' },
        { name: 'Gross Profit (%)', value: rfxRecord.gross_profit_percent + '%' ?? '0%' },
        { name: 'Opportunity Probability', value: rfxRecord.probability ?? '' },

        { name: 'Delivery Duration', value: rfxRecord.delivery_duration ?? '' },
        { name: 'Gross Profit Value', value: '$' + rfxRecord.gross_profit_value ?? '$0' },
        { name: 'Opportunity Forecasted', value: rfxRecord.forcasted ? 'Yes' : 'No' },
        {
            name: 'Description',
            value: rfxRecord.opportunity_description ?? '',
        },
    ])
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [selectedClarificationRow, setSelectedClarificationRow] = useState([])
    const [clarificationTitle, setclarificationTitle] = useState('')
    const [currentRecordDetailDueDate, setCurrentRecordDetailDueDate] = useState('');
    const [currentRecordDetailIssueDate, setCurrentRecordDetailIssueDate] = useState('');
    const [currentRecordDetailRefNum, setCurrentRecordDetailRefNum] = useState('');
    const [CurrentRecordDetailClarType, setCurrentRecordDetailClarType] = useState('');
    const [currentRecordDetailStatus, setCurrentRecordDetailStatus] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [clarificationSelectedDocuments, setclarificationSelectedDocuments] = useState([])
    const [clarificationAssignTo, setclarificationAssignTo] = useState([])
    const [rfxClarPostRows, setRfxClarPostRows] = useState([]);
    const [rfxClarPostDocsRows, setRfxClarPostDocsRows] = useState([]);
    const [currentRecordFirstName, setCurrentRecordFirstName] = useState('');
    const [currentRecordLastName, setCurrentRecordLastName] = useState('');
    const [currentRecordProfilePic, setCurrentRecordProfilePic] = useState('');
    const [currentRecordRfxDesc, setCurrentRecordRfxDesc] = useState('');
    const [selectedSubmissionRow, setSelectedSubmissionRow] = useState('')
    const [selectedSubmissionDocuments, setSelectedSubmissionDocuments] = useState([])
    const [selectedSubmissionSubmittedBy, setSelectedSubmissionSubmittedBy] = useState({})

    const [bidClarificationTitle, setBidClarificationTitle] = useState('')
    const [bidClarificationType, setBidClarificationType] = useState('')
    const [bidClarificationRefNumber, setBidClarificationRefNumber] = useState('')
    const [bidClarificationDescription, setBidClarificationDescription] = useState('')
    const [bidClarificationIssuedDate, setBidClarificationIssuedDate] = useState('')
    const [bidClarificationDueDate, setBidClarificationDueDate] = useState('')
    const [bidClarificationAssignTo, setBidClarificationAssignTo] = useState({})
    const [selectedFilesMain, setSelectedFilesMain] = useState([])
    const [bidClarificationSelectedRow, setBidClarificationSelectedRow] = useState({})
    const [bidClarificationDocuments, setBidClarificationDocuments] = useState([])
    const [addOrderForm, setAddOrderForm] = useState(false)
    const [orderTable, setOrderTable] = useState(true)
    const [orderDetail, setOrderDetail] = useState(true)


    const onPersonSelect = (person) => {
        console.log(person)
    }
    const handleValueChange = (index, newValue) => {
        const updatedData = [...overviewData];
        updatedData[index].value = newValue;
        setoverviewData(updatedData);
    };

    const [stages, setStages] = useState(
        stagesList.map(record => ({
            stage: record.default_name,
            displayName: record.new_name ? record.new_name : record.default_name,
            status: record.stage_status,
            order: record.display_order
        }))
        /*[
            { stage: 'RFx Issued', displayName: 'RFx Issued', status: 'done', order: 1 },
            { stage: 'RFx Acknowledge', displayName: 'RFx Acknowledge', status: 'current', order: 2 },
            { stage: 'Bid Request', displayName: 'Bid Request', status: 'pending', order: 3 },
            { stage: 'RFx Clarifications', displayName: 'RFx Clarifications', status: 'pending', order: 4 },
            { stage: 'Bid Submission', displayName: 'Bid Submission', status: 'pending', order: 5 },
            { stage: 'Bid Acknowledgement', displayName: 'Bid Acknowledgement', status: 'pending', order: 6 },
            { stage: 'Bid Clarifications', displayName: 'Bid Clarifications', status: 'pending', order: 7 },
            { stage: 'Bid Revision', displayName: 'Bid Revision', status: 'pending', order: 8 },
            { stage: 'Order', displayName: 'Order', status: 'pending', order: 9 }
        ]*/
    );

    useEffect(() => {
        const currentStage = stages.find(stage => stage.status === 'current');
        if (currentStage) {
            const { displayName, status } = currentStage;
            contentShow(displayName, status)
        }
    }, []);
    const handleChangeStatus = async (changeContent = true) => {
        // Find the current stage
        const currentStageIndex = stages.findIndex(stage => stage.status === 'current');
        if (currentStageIndex !== -1 && currentStageIndex < stages.length - 1) {

            // changes in DB
            if (stages[currentStageIndex].stage == "RFx Acknowledge") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == 'Bid Request' && personAssignTo.id) {
                const bidn = generateUniqueSixDigitNumber();
                let c1 = await updateBidNumberAction(rfxRecord.rfx_id, bidn)
                let c2 = await updateBidAssignToAction(rfxRecord.rfx_id, personAssignTo.id)
                let c3 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == "RFx Clarifications") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == "Bid Submission") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == "Bid Acknowledgement") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == "Bid Clarifications") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            } else if (stages[currentStageIndex].stage == "Bid Revision") {
                let c1 = await movetoNextStageAction(rfxRecord.rfx_id)
            }

            // Update the current stage to 'done' status
            setStages(prevStages => {
                const updatedStages = [...prevStages];
                updatedStages[currentStageIndex].status = 'done';

                // Update the next stage to 'current' status
                updatedStages[currentStageIndex + 1].status = 'current';

                // Determine content changes based on the next stage
                if (changeContent) {
                    const nextStage = updatedStages[currentStageIndex + 1];
                    contentShow(nextStage.displayName);
                    console.log(nextStage)
                }

                return updatedStages;
            });
        }
    };
    const contentShow = (category, status) => {
        console.log(category, status);
        setActive(category);
        setActive(prevActive => {
            console.log("Active:", prevActive);
            return prevActive;
        });
    };

    const handleDailogTextChange = (event) => {
        setDailogTextValue(event.target.value);
    };
    const calculateProgress = () => {
        const completedStages = stages.filter(stage => stage.status === 'done').length;
        const totalStages = stages.length;
        return Math.floor((completedStages / totalStages) * 100);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'done':
                return '#70d830';
            case 'current':
                return '#26BADA';
            case 'pending':
                return '#b4b4b4';
            default:
                return '#918e8e';
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleDocClickOpen = () => {
        setDocDailog(true);
    }
    const handleClickOpenBid = () => {
        setOpenBid(true);
    };
    const handleClickOpenBidRequestDailog = () => {
        setOpenRequestDailog(true);
    };
    const handleClickOpenContact = () => {
        setOpenContactAssign(true);
    };
    const handlCloseBid = () => {
        setOpenBid(false);
    };
    const handlCloseRequestBidDailog = () => {
        setOpenRequestDailog(false);
    };
    const handlCloseContact = () => {
        setOpenContactAssign(false);
    };
    const handleClose = ({ close, ackDate, ackComment }) => {
        setOpen(false);

        setAcknowledgementDate(ackDate)
        setAcknowledgementComment(ackComment)
    };
    const rfxYesClick = () => {
        handleChangeStatus(false);
        setActiveBidRequestBtn(true);
    }
    const handleDocClose = () => {
        setHideDocSubmitBtn(true);
        setDocDailog(false)
        console.log("Hide")
    }
    const handleRowClick = async (rowId) => {
        setSelectedRowId(rowId)
        setClarificationDetail(true)
        setSelectedUsers([])

        if (active == 'Pre-lim Review') {
            const targetRow = prelimReviewRec.find(item => item.bid_review_id === rowId)
            setSelectedReviewRow(targetRow)
            setViewTemplateDetails(true)
        }
        if (active == 'RFx Clarifications') {
            setShowSubmitedRfxCalrification(true)
            setClarificationDetail(true)
            const targetClarification = clarificationRec.find(item => item.rfx_clarification_id === rowId);
            setSelectedClarificationRow(targetClarification)
            console.log("Row ID:", rowId)
            console.log("Single Record:", targetClarification)
            console.log("All Record:", clarificationRec)
            if (targetClarification) {
                setclarificationTitle(targetClarification.clarification_title);
                setCurrentRecordDetailDueDate(targetClarification.clarification_due_date)
                setCurrentRecordDetailIssueDate(targetClarification.clarification_issued_date)
                setCurrentRecordDetailRefNum(targetClarification.rfx_clarification_ref_num)
                setCurrentRecordDetailClarType(targetClarification.clarification_type)
                setCurrentRecordDetailStatus(targetClarification.status)
                setCurrentRecordFirstName(targetClarification.first_name)
                setCurrentRecordLastName(targetClarification.last_name)
                setCurrentRecordProfilePic(targetClarification.user_profile_photo ? targetClarification.user_profile_photo : '/avatar.png')
                setCurrentRecordRfxDesc(targetClarification.description)
                console.log("Current Record is:", targetClarification)
            }
            // get documents for clarif
            const r1 = await GetRfxDocumentsBy_RfxID_Key_Action(rfxRecord.rfx_id, 'rfx-clarifications-' + rowId)
            setclarificationSelectedDocuments(r1.returnData)
            // get assignto details
            const r2 = await getUserById(targetClarification.assign_to)
            setclarificationAssignTo(r2.data)
            console.log(r2)
            // get clarification post
            const r3 = await getAllRfxClarificationPostRecordsBy_ClarifId_Action(rowId)
            setRfxClarPostRows(r3.returnData)
            // get rfx documents
            const r4 = await GetRfxDocumentsAction(rfxRecord.rfx_id)
            setRfxClarPostDocsRows(r4.returnData)
            console.log(r1, ' clarification documents', 'rfx-clarifications-' + rowId)
            console.log(r2, ' clarification Assignto')
            console.log(clarificationAssignTo, 'AAAssignto')
            console.log(r3, ' clarification Posts')
        }
        if (active == 'Bid Submission') {
            setDocumentDetail(true)
            const r1 = await getAllSubmissionAction(rfxRecord.rfx_id)
            let records = r1.returnData
            // get selected record
            const targetSubmission = records.find(item => item.bid_submission_id === rowId);
            setSelectedSubmissionRow(targetSubmission)
            console.log("Selected Sub roe", selectedSubmissionRow)
            // get selected submission documents
            const r2 = await GetRfxDocumentsBy_RfxID_Key_Action(rfxRecord.rfx_id, 'submission-' + targetSubmission.bid_submission_id)
            records = r2.returnData
            setSelectedSubmissionDocuments(records)
            // get submitted user
            const r3 = await getUserById(r2.returnData.submitted_by)
            records = r3.data
            setSelectedSubmissionSubmittedBy(records)
            console.log('submitted by: ', records)
        }
        if (active == 'Bid Clarifications') {
            setBidDetailInfo(true)
            setBidTable(false)
            // get selected recrod
            const r1 = await getBidClarificationRecordsByIdAction(rowId)
            setBidClarificationSelectedRow(r1.returnData)
            // get assigned user
            const r2 = await getUserById(r1.returnData.assigned_to)
            setBidClarificationAssignTo(r2.data)
            // get documents
            const r3 = await GetRfxDocumentsBy_RfxID_Key_Action(rfxRecord.rfx_id, 'bid-clarifications-' + rowId)
            setBidClarificationDocuments(r3.returnData)
            console.log('Bid clarification documents: ', r3.returnData)

        }
        if (active == 'Order') {
            setOrderDetail(true)
            setOrderTable(false)
        }


        let r3 = await getAllReviewContactsBy_BidReviewID_Action(rowId)
        if (r3.statusCode == 200) {
            let records = r3.returnData
            const mappeddata = records.filter(item => item.user_id !== 0).map((item) => ({
                id: item.user_id,
                name: `${item.first_name} ${item.last_name}`,
                image: item.user_profile_photo ? item.user_profile_photo : '/avatar.jpg',
                role: item.review_role
            }));
            setSelectedUsers(mappeddata)
        }
        console.log("Seelll", selectedUsers)
    }
    // const handleRowClick = () => {
    //     setClarificationDetail(true)
    //     // handleChangeStatus('Bid Submission', false)
    // }
    const handleDocRowClick = () => {
        setDocumentDetail(true)
    }
    const handleBidRowClick = () => {
        setBidDetail(true)
        setBidTable(false)
    }
    const filteredClarifications = clarificationRec.map(clarification => ({
        id: clarification.rfx_clarification_id,
        title: clarification.clarification_title,
        type: clarification.clarification_type,
        submitDate: clarification.clarification_issued_date,
        dueDate: clarification.clarification_due_date,
        status: clarification.status
    }));



    const tabs = [
        { label: 'Item One', content: "<TabContentOne />" },
        { label: 'Item Two', content: "<TabContentTwo />" },
        { label: 'Item Three', content: "<TabContentThree />" },
    ];
    const breadcrumbItems = [{ label: 'Dashboard', href: '/' }, { label: 'RFx List', href: '/rfx' }, { label: rfxRecord.rfx_id, href: '/rfx/detail/' + rfxRecord.rfx_id }];
    const [rows, setRows] = useState([]);
    const [clarificationRows, setClarificationRows] = useState(filteredClarifications);
    const [bidClarificationRows, setBidClarificationRows] = useState(
        bidClarifRec.map((calr, index) => ({
            id: calr.bid_clarification_id,
            Title: calr.title,
            Type: calr.type,
            RefrenceNum: calr.reference_num,
            IssuedDate: calr.issued_date,
            DueDate: calr.due_date,
            Status: calr.status
        }))
    );

    const [submissionrows, setSubmissionrows] = useState(
        submissionRec.map((sub, index) => ({
            id: sub.bid_submission_id,
            Type: sub.bid_type,
            Stage: sub.bid_stage,
            RefNumber: sub.reference_number,
            IssuedDate: sub.issued_date,
            Status: sub.status
        }))
    );
    const Bidrows = []
    const typeInput = [
        { value: "Technical", label: "Technical" },
        { value: "Commercial", label: "Commercial" },
        { value: "Commercial Unpriced", label: "Commercial Unpriced" },
        { value: "Combined Techno Commercial", label: "Combined Techno Commercial" },
    ];
    const datePickerLabels = ["Issue Date", "Due Date"]
    // Function to add a new row
    const addClarificationRow = () => {
        const newRow = {
            id: clarificationRows.length + 1,
            checkbox: 'dddd.png',
            description: 'New Opportunity',
            crmId: 'newCrmId',
            customer: 'New Customer',
            issueDate: 'New Date',
            salePerson: 'New Salesperson',
            status: 'New Status',
        };

        // Update the rows state
        setClarificationRows((prevRows) => [...prevRows, newRow]);
    };
    const handleReplySubmit = async () => {
        const data = {
            "rfx_clarification_id": selectedClarificationRow.rfx_clarification_id,
            "posted_by": login_user_id,
            "post_number": 0,
            "title": "",
            "comment": replyMessage,
            "parent_id": 0
        }
        // add clarifications post & files
        let r1 = await createRfxClarificationCommentAction(data)
        if (r1.statusCode == 200 && selectedFilesMain.length > 0) {
            uploadFiles(selectedFilesMain, apiBackendURL, tenantID, rfxRecord.rfx_id, 'rfx-clarifications')
            let fileArray = []
            for (var i = 0; i < selectedFilesMain.length; i++) {
                const file = {
                    name: selectedFilesMain[i].name,
                    type: selectedFilesMain[i].type,
                    size: selectedFilesMain[i].size,
                };
                let clarif_post_id = r1.returnData.rfx_clarification_post_id
                let r2 = await createDocUploadAction(rfxRecord.rfx_id, login_user_id, file, 'rfx-clarifications-post-' + clarif_post_id)
            }
        }
        /*const newMessage = {
            text: replyMessage,
            files: uploadedFiles
        };
        setMessages([...messages, newMessage]);
        console.log("RFX DET", messages)
        setReplyMessage('');
        setUploadedFiles([]);
        setShowReply(false);*/
    };
    const handleReplySubmitBidClar = () => {
        const newMessage = {
            text: replyMessageBidClar,
            files: uploadedFiles
        };
        setMessagesBidClar([...messages, newMessage]);
        console.log("RFX DET", messages)
        setReplyMessageBidClar('');
        setUploadedFiles([]);
        setShowBidClarReply(false);
    };
    const handleFileUpload = (files) => {
        setUploadedFiles([...uploadedFiles, ...files]);
    };
    const addBidClarificationRow = async () => {
        if (!bidClarificationTitle || !bidClarificationType || !bidClarificationIssuedDate || !bidClarificationDueDate) {
            alert("Please fill the required fields.");
            return false;
        }
        const data = {
            "rfx_id": rfxRecord.rfx_id,
            "submitted_by": login_user_id,
            "assigned_to": personAssignTo.id ? personAssignTo.id : 0,
            "reference_num": bidClarificationRefNumber,
            "title": bidClarificationTitle,
            "type": bidClarificationType,
            "status": 'Issued',
            "description": bidClarificationDescription,
            "issued_date": bidClarificationIssuedDate,
            "due_date": bidClarificationDueDate,
            "completed": false,
        }
        // create bid clarification
        const r1 = await createBidClarificationAction(data)
        if (r1.statusCode == 200 && selectedFilesMain.length > 0) {
            uploadFiles(selectedFilesMain, apiBackendURL, tenantID, rfxRecord.rfx_id, 'bid-clarifications')
            let fileArray = []
            for (var i = 0; i < selectedFilesMain.length; i++) {
                const file = {
                    name: selectedFilesMain[i].name,
                    type: selectedFilesMain[i].type,
                    size: selectedFilesMain[i].size,
                };
                let clarif_id = r1.returnData.bid_clarification_id
                let r2 = await createDocUploadAction(rfxRecord.rfx_id, login_user_id, file, 'bid-clarifications-' + clarif_id)
            }
        }
        // get all bid clarification
        const r2 = await getAllBidClarificationRecordsBy_RfxID_Action(rfxRecord.rfx_id)
        const records = r2.returnData
        const mappedData = records.map((calr, index) => ({
            id: calr.bid_clarification_id,
            Title: calr.title,
            Type: calr.type,
            RefrenceNum: calr.reference_num,
            IssuedDate: calr.issued_date,
            DueDate: calr.due_date,
            Status: calr.status
        }))
        setBidClarificationRows(mappedData);

    };
    const onYesButtonClick = () => {

    }
    const NoRowsOverlayClarification = () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
            <Image src="/no-row.png" width={480} height={260} alt="No Rows" />
            <p className='text-[#252631] text-xl mb-3'>No clarifications yet</p>
            <p className='text-[#778CA2] text-lg font-light mb-3'>You’ll see them here if there are any clarifications posted</p>
        </Stack>
    );
    const NoRowsOverlayOrder = () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
            <Image src="/no-order.png" width={480} height={260} alt="No Rows" />
            <p className='text-[#252631] text-xl mb-3'>No Orders found</p>
            <p className='text-[#778CA2] text-lg font-light mb-3'>You can create a new one here</p>
            <div className="flex items-center gap-6">
                <button className='text-white bg-[#26BADA] p-3 uppercase  min-w-[200px]' onClick={() => { setAddOrderForm(true); setOrderTable(false) }}>Add Order</button>
                <button className='text-white bg-[#26BADA] p-3 uppercase  min-w-[200px]' onClick={handleBidRowClick}>Mark as lost</button>
            </div>
        </Stack>
    );
    const NoRowsOverlayDocuments = () => (
        <Stack height="100%" alignItems="center" justifyContent="center">
            <Image src="/no-doc.png" width={480} height={260} alt="No Rows" />
            <p className='text-[#252631] text-xl mb-3'>No bid documents recieved yet</p>
            <p className='text-[#778CA2] text-lg font-light mb-3'>You’ll see it here once its posted</p>
        </Stack>
    );
    const NoRowsOverlayBids = () => (
        <Stack height="auto" alignItems="center" justifyContent="center">
            <Image src="/no-clarification.png" width={480} height={260} alt="No Rows" />
            <p className='text-[#252631] text-xl mb-3'>No clarifications requested yet</p>
            <p className='text-[#778CA2] text-lg font-light mb-3'>You can request clarifications around the bid here</p>
            <div className="flex items-center gap-6">
                <button className='text-white bg-[#26BADA] p-3 uppercase  min-w-[200px]' onClick={handleBidRowClick}>Request Clarification</button>
                <button className='text-white bg-[#26BADA] p-3 uppercase  min-w-[200px]' onClick={handleBidRowClick}>Skip Clarification</button>
            </div>
        </Stack>
    );



    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            {/* NOTIFICATION DIV */}
            <div className="flex bg-white mb-6 ">
                <div className="flex justify-between max-w-[60%] w-full border-r border-gray-200 p-[10px]">
                    <span className="text-xl">{data?.title}</span>
                    <span className="text-sm text-[#FF912B]"> :{rfxRecord.rfx_number ? rfxRecord.rfx_number : rfxRecord.rfx_id}</span>
                </div>
                <Link href='/activity-feed' className=" px-8 whitespace-nowrap flex items-center justify-center gap-2 text-[#98A9BC] border-r border-gray-200">
                    <FaRegCalendarMinus />
                    <p>Activity Feed</p>
                </Link>
                <Link href='/messages' className=" px-8 whitespace-nowrap flex items-center justify-center gap-2 text-[#98A9BC] border-r border-gray-200">
                    <Image src="/msg.svg" width={22} height={25} alt="No Rows" />
                    <p> <span className="text-black">21</span> Messages</p>
                </Link>
                <Link href='alerts' className=" px-8 whitespace-nowrap flex items-center justify-center gap-2 text-[#98A9BC] border-r border-gray-200">
                    <Image src="/bell.svg" width={22} height={25} alt="No Rows" />
                    <p> <span className="text-black">2</span> Alerts</p>
                </Link>
                <div className="whitespace-nowrap flex items-center justify-center px-8"><BsThreeDots /></div>
            </div>
            {/* DASHBOARD CARDS */}
            <div className="flex items-center justify-between gap-5">
                <div className="flex bg-white p-5 justify-between items-center w-[33%] shadow-sm">
                    <div className="rounded-full bg-[#00AAEC] p-[14px] mr-5 ring-offset-2 ring-2 ring-[#00AAEC]">
                        <VscChecklist className="text-white text-[22px]" />
                    </div>
                    <div className="flex flex-col flex-[3]">
                        <p className="text-sm text-[#98A9BC]">RFx Clarifications</p>
                        <span className="text-[26px]">-/-</span>
                    </div>
                    <div className="flex-[1]">
                        <span className="text-sm">-%</span>
                    </div>
                </div>
                <div className="flex bg-white p-5 justify-between items-center w-[33%] shadow-sm">
                    <div className="rounded-full bg-[#FFAB2B] p-[14px] mr-5 ring-offset-2 ring-2 ring-[#FFAB2B]">
                        <VscChecklist className="text-white text-[22px]" />
                    </div>
                    <div className="flex flex-col flex-[3]">
                        <p className="text-sm text-[#98A9BC]">Bid Clarifications</p>
                        <span className="text-[26px]">-/-</span>
                    </div>
                    <div className="flex-[1]">
                        <span className="text-sm">-%</span>
                    </div>
                </div>
                <div className="flex bg-white p-5 justify-between items-center w-[33%] shadow-sm">
                    <div className="rounded-full bg-[#6DD230] p-[14px] mr-5 ring-offset-2 ring-2 ring-[#6DD230]">
                        <FaBarsProgress className="text-white text-[22px]" />
                    </div>
                    <div className="flex flex-col flex-[3]">
                        <progress id="file" value={calculateProgress()} max="100" className="h-[6px] progressbar mb-2"></progress>
                        <p className="text-sm text-[#98A9BC]">Completion Progress</p>
                    </div>
                    <div className="flex-[1]">
                        <span className="text-sm text-[#FE4D97]">{calculateProgress()}%</span>
                    </div>
                </div>
            </div>
            <div className="bg-white px-2 mt-[14px] py-4 flex justify-start">
                {stages.map((stageData, index) => (
                    <svg key={index} xmlns="http://www.w3.org/2000/svg" width="10%" viewBox="0 0 155 40" fill="none" onClick={() => contentShow(stageData.stage, stageData.status)} className={`${stageData.status === 'pending' ? 'cursor-not-allowed' : 'cursor-pointer'}`} disabled={stageData.status === 'pending'}>
                        <g filter={`url(#filter0_d_4480_${index})`}>
                            <mask id="path-1-inside-1_4480_12163" fill="white">
                                <path fillRule="evenodd" clipRule="evenodd" d="M139.193 2.34255C138.434 1.48859 137.346 1 136.204 1H6.90724C3.45584 1 1.62462 5.07785 3.9176 7.65745L11.6377 16.3425C12.9848 17.8581 12.9848 20.1419 11.6377 21.6575L3.9176 30.3425C1.62462 32.9221 3.45585 37 6.90724 37H136.204C137.346 37 138.434 36.5114 139.193 35.6575L151.638 21.6575C152.985 20.1419 152.985 17.8581 151.638 16.3425L139.193 2.34255Z" />
                            </mask>
                            <path fillRule="evenodd" clipRule="evenodd" d="M139.193 2.34255C138.434 1.48859 137.346 1 136.204 1H6.90724C3.45584 1 1.62462 5.07785 3.9176 7.65745L11.6377 16.3425C12.9848 17.8581 12.9848 20.1419 11.6377 21.6575L3.9176 30.3425C1.62462 32.9221 3.45585 37 6.90724 37H136.204C137.346 37 138.434 36.5114 139.193 35.6575L151.638 21.6575C152.985 20.1419 152.985 17.8581 151.638 16.3425L139.193 2.34255Z" fill="white" />
                            <path d="M11.6377 16.3425L10.8903 17.0069H10.8903L11.6377 16.3425ZM11.6377 21.6575L12.3851 22.3218L11.6377 21.6575ZM151.638 21.6575L150.89 20.9931L151.638 21.6575ZM151.638 16.3425L150.89 17.0069L151.638 16.3425ZM139.193 2.34255L139.941 1.67818L139.193 2.34255ZM139.193 35.6575L139.941 36.3218L139.193 35.6575ZM6.90724 2H136.204V0H6.90724V2ZM12.3851 15.6782L4.66501 6.99309L3.17019 8.32182L10.8903 17.0069L12.3851 15.6782ZM12.3851 22.3218C14.069 20.4274 14.069 17.5726 12.3851 15.6782L10.8903 17.0069C11.9006 18.1436 11.9006 19.8564 10.8903 20.9931L12.3851 22.3218ZM4.66501 31.0069L12.3851 22.3218L10.8903 20.9931L3.17019 29.6782L4.66501 31.0069ZM136.204 36H6.90724V38H136.204V36ZM150.89 20.9931L138.446 34.9931L139.941 36.3218L152.385 22.3218L150.89 20.9931ZM150.89 17.0069C151.901 18.1436 151.901 19.8564 150.89 20.9931L152.385 22.3218C154.069 20.4274 154.069 17.5726 152.385 15.6782L150.89 17.0069ZM138.446 3.00691L150.89 17.0069L152.385 15.6782L139.941 1.67818L138.446 3.00691ZM3.17019 29.6782C0.303962 32.9027 2.593 38 6.90724 38V36C4.31869 36 2.94527 32.9416 4.66501 31.0069L3.17019 29.6782ZM136.204 2C137.061 2 137.877 2.36644 138.446 3.00691L139.941 1.67818C138.992 0.610742 137.632 0 136.204 0V2ZM136.204 38C137.632 38 138.992 37.3893 139.941 36.3218L138.446 34.9931C137.877 35.6336 137.061 36 136.204 36V38ZM6.90724 0C2.59299 0 0.303962 5.09731 3.17019 8.32182L4.66501 6.99309C2.94527 5.05839 4.31869 2 6.90724 2V0Z" fill={getStatusColor(stageData.status)} mask="url(#path-1-inside-1_4480_12163)" />
                            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill={getStatusColor(stageData.status)} fontSize="13">{stageData.stage}</text>
                        </g>
                        <defs>
                            <filter id={`filter0_d_4480_${index}`} x="0.899414" y="0" width="153.749" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dy="1" />
                                <feGaussianBlur stdDeviation="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0.215686 0 0 0 0 0.254902 0 0 0 0 0.317647 0 0 0 0.08 0" />
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4480_12155" />
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4480_12155" result="shape" />

                            </filter>
                        </defs>
                    </svg>
                ))}
            </div>

            {/* <div className="flex items-center justify-between bg-[#FFF8EE] shadow-md p-2 mt-4">
                <div className="">
                    <FaInfoCircle className="text-[#FFAB2B]" />
                </div>
                <div className="">
                    <p className="text-[#778CA2] ">RFQ acknowledgement awaited. <Link href="/" className="text-[#00AAEC] "> Upload RFx Acknowledgement</Link></p>
                </div>
                <div className=""><RxCrossCircled className="text-[#26BADA]" /></div>
            </div> */}
            <div className="flex gap-2 mt-2">
                <span className={`font-medium bg-white px-4 py-2 border border-[#ddd] cursor-pointer ${active === 'Overview' ? 'text-black' : 'text-[#778CA2]'}`} onClick={() => contentShow('Overview')}>Overview</span>
                <span className={`font-medium bg-white px-4 py-2 border border-[#ddd] cursor-pointer ${active === 'RFx Clarifications' ? 'text-black' : 'text-[#778CA2]'}`} onClick={() => contentShow('RFx Clarifications')}>RFx Clarifications</span>
                <span className={`font-medium bg-white px-4 py-2 border border-[#ddd] cursor-pointer ${(active === 'Bid Documents' || active === 'Bid Acknowledge' || active === 'Bid Acknowledgement' || active === 'Bid Submission') ? 'text-black' : 'text-[#778CA2]'}`} onClick={() => contentShow('Bid Documents')}>Bid Documents</span>
                <span className={`font-medium bg-white px-4 py-2 border border-[#ddd] cursor-pointer ${active === 'Bid Clarifications' ? 'text-black' : 'text-[#778CA2]'}`} onClick={() => contentShow('Bid Clarifications')}>Bid Clarifications</span>
                <span className={`font-medium bg-white px-4 py-2 border border-[#ddd] cursor-pointer ${active === 'Order' ? 'text-black' : 'text-[#778CA2]'}`} onClick={() => contentShow('Order')}>Order</span>
            </div>
            <div className="Content bg-white">
                {(active === 'Overview' || active === 'RFx Acknowledge' || active === 'Bid Request') && <div className="bg-white p-8 mt-1">
                    <div className="flex w-full">
                        <form className="grid grid-cols-2 gap-4  p-4 flex-[2]">
                            {overviewData.map((item, index) => (
                                <div className={`mt-3 ${item.name === 'Description' ? 'col-span-2' : ''}`} key={index}>
                                    <span className=" block text-[#778CA2]">{item.name}</span>
                                    {item.name === 'Description' ? (
                                        <textarea
                                            className="border border-gray-200 p-2 outline-1 outline-gray-300 w-full"
                                            value={item.value}
                                            rows={4}
                                            onChange={(e) => handleValueChange(index, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="border border-gray-200 p-2 outline-1 outline-gray-300 w-full"
                                            value={item.value}
                                            onChange={(e) => handleValueChange(index, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </form>
                        <div className="flex-[1] flex flex-col">
                            <div className="flex items-center gap-3 mt-[-16px]">
                                <span className="text-[#778CA2]">Last Updated: 26 Jul, 2021</span>
                                <span className="text-[#778CA2]">10:00 AM</span>
                                <span className="text-[#26BADA]"><LuRefreshCcw /></span>
                            </div>
                            <button className={` text-center  py-3 mt-[10px] mb-[18px] rounded-md border-0 ${avtiveBidRequestBtn ? 'bg-[#26BADA] text-white' : 'text-[#778CA2] bg-[#EFF3F5]'}`}
                                onClick={handleClickOpenBidRequestDailog}
                                onPersonSelect={onPersonSelect}
                                // disabled={rfxRecord.bid_number ? true : false}
                                disabled={!avtiveBidRequestBtn}
                            >{bidNumber?.length ? 'BID IS REQUESTED' : 'REQUEST BID'}</button>
                            <BidDialog
                                keyContactsRec={allUsersRec}
                                openBid={openRequestDailog}
                                handleBidClose={handlCloseRequestBidDailog}
                                // onYesButtonClick={() => handleChangeStatus('RFx Clarifications')}
                                onYesButtonClick={() => handleChangeStatus()}
                                setPersonAssignTo={setPersonAssignTo}
                            />
                            <div className="border mt-[18px] mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] " > Critical Dates</div>
                                <div className="bg-[#F4FCFD] px-4 py-5 ">
                                    <span className="text-[#778CA2] block">Issued Date</span>
                                    <span>{rfxRecord.issued_date ? formatDateString(rfxRecord.issued_date) : 'No Date'}</span>
                                </div>
                                <div className="border-b border-[#E8ECEF] w-[90%] m-auto"></div>
                                <div className="bg-[#F4FCFD] px-4 py-5">
                                    <span className="text-[#778CA2] block">Technical Clarification Deadline</span>
                                    <span>{rfxRecord.tech_clarification_deadline ? formatDateString(rfxRecord.tech_clarification_deadline) : 'No Date'}</span>
                                </div>
                                <div className="border-b border-[#E8ECEF] w-[90%] m-auto"></div>
                                <div className="bg-[#F4FCFD] px-4 py-5">
                                    <span className="text-[#778CA2] block">Commercial Clarification Deadline</span>
                                    <span>{rfxRecord.com_clarification_deadline ? formatDateString(rfxRecord.com_clarification_deadline) : 'No Date'}</span>
                                </div>
                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Assigned to</div>
                                <div className="bg-[#F4F5F6] px-4 py-5 flex  items-center justify-between">
                                    {initiatorRec && (<div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                        <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" alt="user" />
                                        <div className="">
                                            <span className="text-sm leading-4">{initiatorRec.first_name} {initiatorRec.last_name}</span>
                                            <span className="text-sm leading-4 text-[#778CA2] block">{initiatorRec.designation_title}</span>
                                        </div>
                                    </div>)}
                                    {/* <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 ">Sales Person</div> */}

                                </div>
                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >RFx Contacts</div>
                                {keyContactsRec.map((item, index) => (
                                    <div className="bg-[#F4F5F6] px-4 py-1 flex  items-center justify-between" key={index}>
                                        <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                            <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" alt='user' />
                                            <div className="">
                                                <span className="text-sm leading-4">{item.first_name} {item.last_name}</span>
                                                <span className="text-sm leading-4 text-[#778CA2] block">{item.designation}</span>
                                            </div>

                                        </div>
                                        <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center ">{item.contact_key}</div>
                                    </div>
                                ))}

                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                    <span className="flex items-center gap-2">RFx Acknowledgement</span>
                                    {avtiveBidRequestBtn && <span className='flex items-center'><FaCircleCheck className='text-green-500 mr-2' /> {formatDatetime(rfxRecord.acknowledgement_submitted_on ? rfxRecord.acknowledgement_submitted_on : acknowledgementDate)}</span>}
                                </div>
                                <div className="bg-[#F4F5F6] py-6 flex items-center flex-col gap-3">
                                    <p className={` text-lg ${avtiveBidRequestBtn ? `text-green-500 ` : 'text-[#FFAB2B]'}`}>{avtiveBidRequestBtn ? DailogtextValue : 'Awaited'}</p>
                                    {!avtiveBidRequestBtn && <p className="text-[#00AAEC] cursor-pointer" onClick={handleClickOpen}>Upload RFx Acknowldegement</p>}
                                    {avtiveBidRequestBtn && <p className="text-[#000000] text-center px-2">{rfxRecord.acknowledgement_comment ? rfxRecord.acknowledgement_comment : acknowledgementComment}</p>}
                                    <UploadDialog open={open} handleClose={handleClose} onYesClick={rfxYesClick} handleTextChange={handleDailogTextChange} textValue={DailogtextValue} rfxID={rfxRecord.rfx_id} tenantID={tenantID} apiBackendURL={apiBackendURL} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                {/* RFX clarification start  */}
                {active === 'RFx Clarifications' && <div className='p-5 bg-white shadow-sm h-full min-h-screen'>
                    {!clarificationDetail &&
                        <>
                            <div className="flex justify-end uppercase text-[#00AAEC] text-sm mb-4 cursor-pointer ">
                                {/* <div className="flex items-center gap-1" onClick={addClarificationRow}>
                                    <span>New clarification</span>
                                    <IoMdAddCircleOutline />
                                </div> */}
                                <button
                                    className={`upprecase my-5 uppercase rounded-md p-2  bg-[#00AAEC] text-white cursor-pointer flex items-center gap-1`}
                                    onClick={() => { handleChangeStatus() }}
                                    disabled={false}
                                >
                                    Proceed <FaArrowRight />
                                </button>

                            </div>
                            <SearchTableNew rows={clarificationRows} handleRowClick={handleRowClick} NoRowsOverlay={NoRowsOverlayClarification} />

                        </>
                    }
                    {showSubmitedRfxCalrification && (
                        <div className="flex gap-6">
                            <div className="flex flex-[3] flex-col">
                                <div className=" flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => setClarificationDetail(false)}>
                                    <FaChevronLeft />
                                    <span>  Back to List</span>
                                </div>
                                <p className='text-xl p-2'>{clarificationTitle}</p>
                                <div className="flex flex-col-reverse">
                                    <div className="border mb-3 rounded-md ">
                                        <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                            <p>#1</p>
                                            <p>Posted by <span className='text-[#00AAEC]'>{selectedClarificationRow?.first_name} {selectedClarificationRow?.last_name}</span> on {formatDatetime(selectedClarificationRow?.posted_on)}</p>
                                        </div>
                                        <div className="bg-[#F4F5F6] p-6 flex flex-col gap-5">
                                            <p>{selectedClarificationRow?.description}</p>
                                            <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                            {clarificationSelectedDocuments.map((doc, index) => (
                                                <div className="bg-[#E8ECEF] shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                    <FaRegFilePdf className='text-red-600' />
                                                    <span className=''>{doc.docvalt_filename}</span>
                                                    <span className='text-[#98A9BC]'>{doc.file_size}</span>
                                                    <span className='text-[#98A9BC]'>{formatDateString(doc.created_date)}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span><Image src="/msg.svg" width={18} height={21} /></span>
                                                        <BsThreeDots className='text-[#98A9BC]' />
                                                    </div>

                                                </div>
                                            ))}

                                            {!showReply && <button className='bg-[#26BADA] p-3 max-w-[200px] text-white rounded-sm' onClick={setShowReply}>REPLY</button>
                                            }                                    </div>
                                    </div>

                                    {rfxClarPostRows && rfxClarPostRows.map((post, index) => (
                                        <div className="border mb-3 rounded-md ">
                                            <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                                <p>#{index + 2}</p>
                                                <p>Posted by <span className='text-[#00AAEC]'>{post.first_name} {post.last_name}</span> on  {formatDatetime(post.posted_on)} </p>
                                            </div>
                                            <div className="bg-white p-6 flex flex-col gap-5">
                                                <p>{post.comment} </p>
                                                <p className='text-[#778CA2] mt-3'>Attached Documents</p>

                                                {rfxClarPostDocsRows
                                                    .filter(item => item.docvalt_key === 'rfx-clarifications-post-' + post.rfx_clarification_post_id)
                                                    .map((item, index) => (
                                                        <div className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                            {
                                                                ['jpg', 'png', 'jpeg'].includes(item.file_type)
                                                                    ?
                                                                    <FaRegFileImage className='text-[#00AAEC]' />
                                                                    :
                                                                    <FaRegFilePdf className='text-red-600' />
                                                            }
                                                            <span className=''>{item.docvalt_filename}</span>
                                                            <span className='text-[#98A9BC]'>{item.file_size}</span>
                                                            <span className='text-[#98A9BC]'>{formatDateString(item.created_at)}</span>
                                                            <div className="flex items-center gap-2 text-[#98A9BC]">
                                                                <MdOutlineModeEdit className='cursor-pointer' />
                                                                <RiDeleteBin6Line className='cursor-pointer' />
                                                                <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' /></span>
                                                                <BsThreeDots className='cursor-pointer' />
                                                            </div>

                                                        </div>))}

                                            </div>
                                        </div>))}

                                    {messages.map((message, index) => (
                                        <div className="border mb-3 rounded-md " key={index}>
                                            <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                                <p>#00{index}</p>
                                                <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                            </div>
                                            <div className="bg-white p-6 flex flex-col gap-5">
                                                <p>{message.text}</p>
                                                {message.files.length > 0 && (
                                                    <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                                )}
                                                {message.files.map((file, fileIndex) => (
                                                    <div key={fileIndex} className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]">
                                                        {file.type === 'image/png' ? <FaRegFileImage className='text-[#00AAEC]' /> : <FaRegFilePdf className='text-red-600' />}
                                                        <span className=''>{file.name}</span>
                                                        <span className='text-[#98A9BC]'>{file.size}kb</span>
                                                        <span className='text-[#98A9BC]'>{file.lastModifiedDate}</span>
                                                        <div className="flex items-center gap-2 text-[#98A9BC]">
                                                            <MdOutlineModeEdit className='cursor-pointer' />
                                                            <RiDeleteBin6Line className='cursor-pointer' />
                                                            <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' /></span>
                                                            <BsThreeDots className='cursor-pointer' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                {showReply && (
                                    <div className="flex flex-col gap-[18px]">
                                        <textarea
                                            className='w-full border border-[#E8ECEF] outline-none p-2 rounded-md'
                                            placeholder='Reply to post'
                                            rows={4}
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                        ></textarea>
                                        <DragDrop onFileUpload={handleFileUpload} setSelectedFilesMain={setSelectedFilesMain} setAttachedDocuments={setAttachedDocuments} />
                                        <button
                                            className='bg-[#26BADA] border border-[#26BADA] text-white uppercase text-sm px-8 py-3 max-w-[200px] rounded-sm ml-auto'
                                            onClick={handleReplySubmit}
                                        >
                                            SUBMIT REPLY
                                        </button>
                                    </div>
                                )}

                            </div>
                            <div className="flex-[2]">
                                <div className="flex justify-end mb-1">
                                    <button className='upprecase uppercase max-w-[200px] rounded-md p-2 bg-[#00AAEC] text-white cursor-pointer flex items-center gap-1' onClick={handleChangeStatus} >Proceed <FaArrowRight /> </button>
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Status <span className='text-black'>{currentRecordDetailStatus}</span></div>
                                    <div className="bg-[#c3eff92f] px-4 py-1 flex flex-col  ">
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Referrence #</span> <br />
                                                <span>{currentRecordDetailRefNum}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Type</span> <br />
                                                <span>{CurrentRecordDetailClarType}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Issue Date</span> <br />
                                                <span>{currentRecordDetailIssueDate}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Due Date</span> <br />
                                                <span>{currentRecordDetailDueDate} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between" >
                                        <p>Issued to</p>
                                        <p className='uppercase text-[#26BADA]'>Reassign</p>
                                    </div>
                                    {clarificationAssignTo?.first_name && <div className="bg-[#F4F5F6] py-3 px-4 flex   items-center justify-between">
                                        <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                            <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                            <div className="">
                                                <span className="text-sm leading-4">{clarificationAssignTo?.first_name} {clarificationAssignTo?.last_name}</span>
                                                <span className="text-sm leading-4 text-[#778CA2] block">{clarificationAssignTo?.designation_title}</span>
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Key Contacts</div>
                                    <div className="bg-[#F4F5F6] py-3 px-4 flex  items-center justify-between">
                                        <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                            <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                            <div className="">
                                                <span className="text-sm leading-4">Michael Gates</span>
                                                <span className="text-sm leading-4 text-[#778CA2] block">Account Manager</span>
                                            </div>
                                        </div>
                                        <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center ">Requester</div>

                                    </div>

                                    <div className="bg-[#F4F5F6] py-3 px-4 flex  items-center justify-between">
                                        <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full ">
                                            <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                            <div className="">
                                                <span className="text-sm leading-4 w-8">John Smith</span>
                                                <span className="text-sm leading-4 text-[#778CA2] block">Buyer</span>
                                            </div>
                                            <div className="bg-red-300 text-xs px-1 ml-2 text-white">E</div>
                                        </div>
                                        <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center ">Buyer</div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>}


                {(active === 'Bid Documents' || active === 'Bid Acknowledge' || active === 'Bid Acknowledgement' || active === 'Bid Submission') && <div>
                    {!documentDetail && <div className='p-5 bg-white shadow-sm h-full min-h-screen'>
                        <div className="flex justify-end uppercase text-[#00AAEC] text-sm mb-4 cursor-pointer ">
                            {/* <div className="flex items-center gap-1" onClick={addClarificationRow}>
                                <span>New Documents</span>
                                <IoMdAddCircleOutline />
                            </div> */}
                            <button className={`upprecase my-5 uppercase rounded-md p-2  bg-[#00AAEC] text-white cursor-pointer flex items-center gap-1`} onClick={() => { handleChangeStatus('Bid Clarifications') }} disabled={false} >Proceed <FaArrowRight /> </button>
                        </div>
                        {showDocTable &&
                            <SearchTableNew rows={submissionrows} handleRowClick={handleRowClick} NoRowsOverlay={NoRowsOverlayDocuments} />
                        }
                    </div>
                    }
                    {documentDetail &&
                        <div className='flex p-8 gap-5 '>
                            <div className='flex-[2]'>
                                <div className="flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => { setShowDocTable(true); setDocumentDetail(false); }}>
                                    <FaChevronLeft />
                                    <span>Back to List!!</span>
                                </div>
                                <div className="border mb-3 rounded-md mt-4 ">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                        <p>{selectedSubmissionRow?.bid_type}</p>
                                        <p>Submitted by <span className='text-[#00AAEC]'>{selectedSubmissionSubmittedBy?.first_name} {selectedSubmissionSubmittedBy?.last_name}</span> on {formatDateString(selectedSubmissionRow?.created_on)}</p>
                                    </div>
                                    <div className="bg-[#F8FAFB] px-6 py-8 flex flex-col gap-5">
                                        <p>{selectedSubmissionRow.description}</p>
                                        <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                        {selectedSubmissionDocuments?.map((item) => (
                                            <div className="bg-[#E8ECEF] shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                {
                                                    ['jpg', 'jpeg', 'png'].some(ext => item.file_type.includes(ext))

                                                        ?
                                                        <FaRegFileImage className='text-red-600' />
                                                        :
                                                        <FaRegFilePdf className='text-red-600' />
                                                }
                                                <span className=''>{item.docvalt_filename}</span>
                                                <span className='text-[#98A9BC]'>{item.file_size}</span>
                                                <span className='text-[#98A9BC]'>{formatDateString(item.created_at)}</span>
                                                <div className="flex items-center gap-2">
                                                    <span><Image src="/msg.svg" width={18} height={21} /></span>
                                                    <BsThreeDots className='text-[#98A9BC]' />
                                                </div>
                                            </div>))}
                                    </div>
                                </div>
                                <div className="">
                                    <p className='flex items-center gap-3 mb-4'>
                                        <Image src="/msg.svg" width={19} height={25} alt='message' />
                                        <span className='text-[#778CA2] text-lg'>Discussions</span>
                                    </p>
                                    {/* CHAT SECTION */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 my-3">
                                            <Image src="/man.jpeg" width={31} height={31} className='mr-1 rounded-full object-cover w-9' alt='user' />
                                            <p className='bg-[#F2F4F6] px-4 py-2 rounded-full max-w-[80%] pr-[20%]'>Hi Bryan,  Thanks for the timely submission. </p>
                                            <span className='uppercase text-[#98A9BC] text-xs'>08:00 PM</span>
                                        </div>
                                        <div className="flex items-center flex-row-reverse gap-1 my-3">
                                            <Image src="/man2.png" width={31} height={31} className='mr-1 rounded-full object-cover w-9' alt='user' />
                                            <p className='bg-[#98A9BC] text-white px-4 py-2 rounded-full max-w-[80%] pr-[20%]'>You are welcome Michael. Thanks </p>
                                            <span className='uppercase text-[#98A9BC] text-xs'>09:30 PM</span>
                                        </div>
                                        <div className="flex items-center gap-1 my-3">
                                            <Image src="/man.jpeg" width={31} height={31} className='mr-1 rounded-full object-cover w-9' alt='user' />
                                            <p className='bg-[#F2F4F6] px-4 py-2 rounded-full max-w-[80%] pr-[20%]'>Hopefully customer will get back with clarifications soon </p>
                                            <span className='uppercase text-[#98A9BC] text-xs'>09:45 PM</span>
                                        </div>
                                        <div className="flex items-center flex-row-reverse gap-1 my-3">
                                            <Image src="/man2.png" width={31} height={31} className='mr-1 rounded-full object-cover w-9' alt='user' />
                                            <p className='bg-[#98A9BC] text-white px-4 py-2 rounded-full max-w-[80%] pr-[20%]'>You are welcome Michael. Thanks</p>
                                            <span className='uppercase text-[#98A9BC] text-xs'>10:00 PM</span>
                                        </div>
                                        {/* If date changes */}
                                        <p className="text-[#778CA2] flex items-center gap-10 my-8 w-[50%] m-auto after:content-[''] after:bg-slate-400 after:w-full after:h-[0.5px] after:border before:content-[''] before:bg-slate-400 before:w-full before:h-[0.5px] before:border">Today</p>
                                        <div className="flex items-center gap-1 my-3">
                                            <Image src="/man.jpeg" width={31} height={31} className='mr-1 rounded-full object-cover w-9' alt='user' />
                                            <p className='bg-[#F2F4F6] px-4 py-2 rounded-full max-w-[80%] pr-[20%]'>Hi Bryan, The clarifications are now posted. Thanks </p>
                                            <span className='uppercase text-[#98A9BC] text-xs'>10:10 PM</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <textarea rows={4} className='p-3 w-full rounded-md mb-2 border border-[#E8ECEF] outline-none' placeholder='Your message'></textarea>
                                        <div className="flex justify-between">
                                            <Image src="/man.jpeg" width={36} height={36} className='rounded-full object-cover' alt='user' />
                                            <button className='text-white border border-[#26BADA] bg-[#26BADA] uppercase text-sm px-8 py-3 min-w-[200px] rounded-sm '>Add</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex-[1] px-5'>
                                <div className="flex flex-col">
                                    {/* {!hideDocBtn && */}
                                    <button className="text-white text-center bg-[#26BADA] py-3 uppercase mb-3 rounded-md border-0" onClick={handleChangeStatus} >Submit to customer</button>
                                    {/* } */}
                                    <button className="text-white text-center bg-[#26BADA] py-3 uppercase mb-3 rounded-md border-0">Request Revision</button>
                                    <UploadDialog open={docDailog} handleClose={handleDocClose} />
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Status <span className='text-black'>{selectedSubmissionRow?.status}</span></div>
                                    <div className="bg-[#c3eff92f] px-4 py-1 flex flex-col  ">
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Referrence #</span> <br />
                                                <span>{selectedSubmissionRow.reference_number}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Type</span> <br />
                                                <span>{selectedSubmissionRow?.bid_type}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Issue Date</span> <br />
                                                <span>{selectedSubmissionRow?.issued_date}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Due Date</span> <br />
                                                <span>{selectedSubmissionRow?.due_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between" >
                                        <p>Assigned to</p>
                                        <p className='uppercase text-[#26BADA]'>Reassign</p>
                                    </div>
                                    <div className="bg-[#F4F5F6] py-3 px-4 flex   items-center justify-between">
                                        <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                            <Image src='/man.jpeg' width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" alt='user' />
                                            <div className="">
                                                <span className="text-sm leading-4">Michael Gates</span>
                                                <span className="text-sm leading-4 text-[#778CA2] block">Account Manager</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Key Contacts</div>
                                    {selectedUsers && selectedUsers.length > 0 ? (
                                        selectedUsers.map((user, index) => (
                                            <div key={index} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                                <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                                    <Image src={user.image} alt={user.name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                                    <div>
                                                        <span className="text-sm leading-4">{user.name}</span>
                                                        <span className="text-sm leading-4 text-[#778CA2] block">{user.role}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center">No Contacts Found</div>
                                    )}


                                </div>
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex items-center gap-2 " >Proposal Acknowledgement{hideDocBtn && <FaCircleCheck className='text-green-500' />}</div>
                                    <div className="bg-[#F4F5F6] py-6 flex items-center flex-col gap-3">
                                        <p className="text-lg text-[#FFAB2B]">Due</p>
                                        <p className="text-[#00AAEC] cursor-pointer" onClick={handleDocClickOpen}>{!hideDocBtn ? 'Upload Customer Bid Acknowldegement' : 'Documents Uploaded'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>}
                </div>}
                {active === 'Bid Clarifications' && <div>
                    {bidTable && <div className='p-5 bg-white shadow-sm h-full min-h-screen'>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={handleBidRowClick}>
                                <span>New Bid clarification</span>
                                <IoMdAddCircleOutline />
                            </div>
                            <div className="flex justify-end uppercase text-[#00AAEC] text-sm mb-4 cursor-pointer ">
                                <button className={`upprecase my-5 uppercase rounded-md p-2  bg-[#00AAEC] text-white cursor-pointer flex items-center gap-1`} onClick={() => { handleChangeStatus() }} disabled={false} >Proceed <FaArrowRight /> </button>
                            </div>
                        </div>

                        <SearchTableNew handleRowClick={handleRowClick} rows={bidClarificationRows} NoRowsOverlay={NoRowsOverlayBids} />
                    </div>
                    }
                    {bidDetail && <div className="flex">
                        <div className="flex-[3] p-5 flex flex-col gap-8">
                            <div className=" flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => { setBidDetail(false); setBidTable(true) }}>
                                <FaChevronLeft />
                                <span>  Back to List</span>
                            </div>
                            <TextField
                                id="outlined-basic"
                                label="Clarification Title"
                                variant="outlined"
                                className="bg-white w-full"
                                // autoFocus
                                // value={bidClarificationSelectedRow.title}
                                onChange={(e) => setBidClarificationTitle(e.target.value)} />
                            <TextField
                                select label="Type" className="bg-white w-[50%]"
                                // value={bidClarificationSelectedRow.type}
                                onChange={(e) => setBidClarificationType(e.target.value)}>
                                {typeInput.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <div className="relative w-[50%]">
                                <AiOutlineQuestionCircle className="absolute right-0.5 top-0.5 z-10 text-[#98A9BC]" />
                                <TextField
                                    id="outlined-basic"
                                    label="Reference#"
                                    // value={bidClarificationSelectedRow.reference_num}
                                    variant="outlined"
                                    // autoFocus
                                    className="bg-white w-full"
                                    onChange={(e) => setBidClarificationRefNumber(e.target.value)} />
                            </div>
                            <textarea
                                className='w-full border border-[#E8ECEF] outline-none p-2 rounded-md'
                                // value={bidClarificationSelectedRow.description}
                                placeholder='Description' rows={8}
                                onChange={(e) => setBidClarificationDescription(e.target.value)}
                            ></textarea>
                            <DragDrop apiBackendURL={apiBackendURL} tenantID={tenantID} setSelectedFilesMain={setSelectedFilesMain} setAttachedDocuments={setAttachedDocuments} />
                            <div className=" flex gap-3">
                                <button className='bg-white border border-[#26BADA] text-[#26BADA] uppercase text-sm px-8 py-3 min-w-[200px] rounded-sm '>Cancel</button>
                                <button className='bg-[#26BADA] border border-[#26BADA] text-white uppercase text-sm px-8 py-3 min-w-[200px] rounded-sm ' onClick={() => { addBidClarificationRow(); setBidDetail(false); setBidTable(true) }} >SUBMIT</button>
                            </div>
                        </div>
                        <div className="flex-[2]">
                            <div className="border mt-[18px] mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] " > Critical Dates</div>
                                <div className="bg-[#F4FCFD] px-4 py-5 w-full flex date-picker flex-col gap-2">

                                    <LocalizationProvider key={"clarification_issued_date"} dateAdapter={AdapterDayjs} className="w-full bg-white block ">
                                        <DemoContainer components={["DatePicker"]}>
                                            <div id={"clarification_issued_date"}>
                                                <DatePicker
                                                    label={"Issued Date *"}
                                                    // value={dayjs(bidClarificationSelectedRow.issued_date)}
                                                    onChange={(date) => setBidClarificationIssuedDate(new Date(date).toISOString().slice(0, 10))}
                                                />
                                            </div>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                    <LocalizationProvider key={"clarification_due_date"} dateAdapter={AdapterDayjs} className="w-full bg-white block ">
                                        <DemoContainer components={["DatePicker"]}>
                                            <div id={"clarification_issued_date"}>
                                                <DatePicker
                                                    label={"Due Date *"}
                                                    // value={dayjs(bidClarificationSelectedRow.due_date)}
                                                    onChange={(date) => setBidClarificationDueDate(new Date(date).toISOString().slice(0, 10))}
                                                />
                                            </div>
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#31282805] py-2 px-[14px] text-[#778CA2] flex justify-between items-center" >
                                    <span>Assign to</span>
                                    <span className='text-[#00AAEC] text-sm uppercase flex gap-1 items-center cursor-pointer' onClick={handleClickOpenContact}>Select contact <IoMdAddCircleOutline /></span>
                                </div>
                                <BidDialog openBid={openContactAssign} handleBidClose={handlCloseContact} keyContactsRec={allUsersRec} setPersonAssignTo={setPersonAssignTo} />
                                <div key={333} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                    {personAssignTo.name && <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                        <Image src={personAssignTo.image} alt={personAssignTo.name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                        <div>
                                            <span className="text-sm leading-4">{personAssignTo.name}</span>
                                            <span className="text-sm leading-4 text-[#778CA2] block">{personAssignTo.role}</span>
                                        </div>
                                    </div>}
                                </div>
                                {console.log("HEY:", selectedUsers)}
                                {/*selectedUsers && selectedUsers.length > 0 ? (
                                    selectedUsers.map((user, index) => (
                                        <div key={index} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                            <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                                <Image src={user.image} alt={user.name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                                <div>
                                                    <span className="text-sm leading-4">{user.name}</span>
                                                    <span className="text-sm leading-4 text-[#778CA2] block">{user.role}</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-lg text-[#FFAB2B] text-center p-3">No Contact Selected</p>

                                )*/}
                                {/* <div className="bg-[#F4F5F6] py-8 flex items-center flex-col gap-3">
                                    <p className="text-lg text-[#FFAB2B]">No Contact Selected</p>
                                </div> */}
                            </div>
                        </div>

                    </div>}
                    {bidDetailInfo &&
                        <div className="flex gap-6">
                            <div className="flex flex-[3] flex-col">
                                <div className=" flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => { setBidDetailInfo(false); setBidTable(true) }}>
                                    <FaChevronLeft />
                                    <span>  Back to List</span>
                                </div>
                                <p className='text-xl p-2'>{bidClarificationSelectedRow.title}</p>
                                <div className="flex flex-col-reverse">
                                    <div className="border mb-3 rounded-md ">
                                        <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                            <p>#001</p>
                                            <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                        </div>
                                        <div className="bg-[#F4F5F6] p-6 flex flex-col gap-5">
                                            <p>{bidClarificationSelectedRow.description}</p>
                                            <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                            {bidClarificationDocuments.map((doc, index) => (<div className="bg-[#E8ECEF] shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                {
                                                    ['jpg', 'jpeg', 'png'].some(ext => doc.file_type.includes(ext))

                                                        ?
                                                        <FaRegFileImage className='text-red-600' />
                                                        :
                                                        <FaRegFilePdf className='text-red-600' />
                                                }
                                                <span className=''>{doc.docvalt_filename}</span>
                                                <span className='text-[#98A9BC]'>{doc.file_size}</span>
                                                <span className='text-[#98A9BC]'>{doc.created_on}</span>
                                                <div className="flex items-center gap-2">
                                                    <span><Image src="/msg.svg" width={18} height={21} alt='messages' /></span>
                                                    <BsThreeDots className='text-[#98A9BC]' />
                                                </div>

                                            </div>))}
                                            {!showBidClarReply && <button className='bg-[#26BADA] p-3 max-w-[200px] text-white rounded-sm' onClick={setShowBidClarReply(true)}>REPLY</button>
                                            }                                    </div>
                                    </div>
                                    {/* <div className="border mb-3 rounded-md ">
                                        <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                            <p>#002</p>
                                            <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                        </div>
                                        <div className="bg-white p-6 flex flex-col gap-5">
                                            <p>{bidClarificationSelectedRow.description}</p>
                                            <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                            <div className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                <FaRegFilePdf className='text-red-600' />
                                                <span className=''>102345-CCL-01.xlxs</span>
                                                <span className='text-[#98A9BC]'>123kb</span>
                                                <span className='text-[#98A9BC]'>23 Jun 2020</span>
                                                <div className="flex items-center gap-2 text-[#98A9BC]">
                                                    <MdOutlineModeEdit className='cursor-pointer' />
                                                    <RiDeleteBin6Line className='cursor-pointer' />
                                                    <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='messages' /></span>
                                                    <BsThreeDots className='cursor-pointer' />
                                                </div>

                                            </div>
                                            <div className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                <FaRegFileImage className='text-[#00AAEC]' />
                                                <span className=''>ScreenShot.png</span>
                                                <span className='text-[#98A9BC]'>123kb</span>
                                                <span className='text-[#98A9BC]'>23 Jun 2020</span>
                                                <div className="flex items-center gap-2 text-[#98A9BC]">
                                                    <MdOutlineModeEdit className='cursor-pointer' />
                                                    <RiDeleteBin6Line className='cursor-pointer' />
                                                    <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='message' /></span>
                                                    <BsThreeDots className='cursor-pointer' />
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
                                    {messagesBidClar.map((message, index) => (
                                        <div className="border mb-3 rounded-md " key={index}>
                                            <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                                <p>#00{index}</p>
                                                <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                            </div>
                                            <div className="bg-white p-6 flex flex-col gap-5">
                                                <p>{message.text}</p>
                                                {message.files.length > 0 && (
                                                    <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                                )}
                                                {message.files.map((file, fileIndex) => (
                                                    <div key={fileIndex} className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]">
                                                        {file.type === 'image/png' ? <FaRegFileImage className='text-[#00AAEC]' /> : <FaRegFilePdf className='text-red-600' />}
                                                        <span className=''>{file.name}</span>
                                                        <span className='text-[#98A9BC]'>{file.size}kb</span>
                                                        <span className='text-[#98A9BC]'>{file.lastModifiedDate}</span>
                                                        <div className="flex items-center gap-2 text-[#98A9BC]">
                                                            <MdOutlineModeEdit className='cursor-pointer' />
                                                            <RiDeleteBin6Line className='cursor-pointer' />
                                                            <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='message' /></span>
                                                            <BsThreeDots className='cursor-pointer' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                {showBidClarReply && (
                                    <div className="flex flex-col gap-[18px]">
                                        <textarea
                                            className='w-full border border-[#E8ECEF] outline-none p-2 rounded-md'
                                            placeholder='Description'
                                            rows={4}
                                            value={replyMessageBidClar}
                                            onChange={(e) => setReplyMessageBidClar(e.target.value)}
                                        ></textarea>
                                        <DragDrop onFileUpload={handleFileUpload} />
                                        <button
                                            className='bg-[#26BADA] border border-[#26BADA] text-white uppercase text-sm px-8 py-3 max-w-[200px] rounded-sm ml-auto'
                                            onClick={handleReplySubmitBidClar}
                                        >
                                            SUBMIT REPLY
                                        </button>
                                    </div>
                                )}

                            </div>
                            <div className="flex-[2]">
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Status <span className='text-black'>{bidClarificationSelectedRow.status}</span></div>
                                    <div className="bg-[#c3eff92f] px-4 py-1 flex flex-col  ">
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Referrence #</span> <br />
                                                <span>{bidClarificationSelectedRow.reference_num}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Type</span> <br />
                                                <span>{bidClarificationSelectedRow.type}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Issue Date</span> <br />
                                                <span>{bidClarificationSelectedRow.issued_date}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Due Date</span> <br />
                                                <span>{bidClarificationSelectedRow.due_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div key={222} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                    <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                        <Image src={bidClarificationAssignTo.user_profile_photo ? bidClarificationAssignTo.user_profile_photo : '/avatar.jpg'} alt={bidClarificationAssignTo.first_name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                        <div>
                                            <span className="text-sm leading-4">{bidClarificationAssignTo.first_name} {bidClarificationAssignTo.last_name}</span>
                                            <span className="text-sm leading-4 text-[#778CA2] block">{bidClarificationAssignTo.designation_title}</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                </div>
                                {/*selectedUsers && selectedUsers.length > 0 ? (
                                    selectedUsers.map((user, index) => (
                                        <div key={index} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                            <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                                <Image src={user.image} alt={user.name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                                <div>
                                                    <span className="text-sm leading-4">{user.name}</span>
                                                    <span className="text-sm leading-4 text-[#778CA2] block">{user.role}</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-lg text-[#FFAB2B] text-center p-3">No Contact Selected</p>

                                )*/}
                            </div>
                        </div>
                    }



                </div>}
                {(active === 'Bid Revision') && <div className='p-5 bg-white shadow-sm h-full min-h-screen'>
                    <button className={`upprecase my-5 uppercase rounded-md p-2  bg-[#00AAEC] text-white cursor-pointer flex items-center gap-1`} onClick={() => { handleChangeStatus() }} disabled={false} >Proceed <FaArrowRight /> </button>
                </div>}
                {active === 'Order' && <div>
                    {orderTable &&
                        <>
                            <div className="flex justify-between px-3">
                                <div className="flex items-center gap-1 text-[#26BADA] cursor-pointer" onClick={() => { setAddOrderForm(true); setOrderTable(false) }}>
                                    <span>New Order</span>
                                    <IoMdAddCircleOutline />
                                </div>
                                <div className="w-[260px] flex items-center justify-between rounded-3xl my-4 bg-white py-[6px] border  px-5">
                                    <input type="text" placeholder='Search within results' className='w-full text-black bg-transparent border-0 outline-none placeholder:text-[#778CA2] placeholder:text-sm' />
                                    <button><IoIosSearch className="transform scale-x-[-1] text-[#778CA2]" /></button>
                                </div>
                            </div>
                            <SearchTableNew handleRowClick={handleRowClick} rows={clarificationRows} NoRowsOverlay={NoRowsOverlayOrder} />
                        </>
                    }
                    {addOrderForm && <div className="flex gap-3">
                        <div className="flex-[3] p-5 flex flex-col gap-8">
                            <div className=" flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => { setAddOrderForm(false); setOrderTable(true) }}>
                                <FaChevronLeft />
                                <span>  Back to List</span>
                            </div>
                            <TextField
                                id="outlined-basic"
                                label="Purchase Order"
                                variant="outlined"
                                className="bg-white w-full"
                            />
                            <div className="flex gap-4">
                                <TextField
                                    select
                                    label="Currency"
                                    // defaultValue="90 days"
                                    className="bg-white w-[50%]"
                                >
                                    {typeInput.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <div className="relative w-[50%]">
                                    <AiOutlineQuestionCircle className="absolute right-0.5 top-0.5 z-10 text-[#98A9BC]" />
                                    <TextField
                                        id="outlined-basic"
                                        label="Order Value"
                                        variant="outlined"
                                        className="bg-white w-full"
                                    />
                                </div>
                            </div>
                            <textarea className='w-full border border-[#E8ECEF] outline-none p-2 rounded-md' placeholder='Description' rows={8} ></textarea>
                            <DragDrop className="w-full" />
                            <div className=" flex gap-3">
                                <button className='bg-white border border-[#26BADA] text-[#26BADA] uppercase text-sm px-8 py-3 min-w-[200px] rounded-sm '>Cancel</button>
                                <button className='bg-[#26BADA] border border-[#26BADA] text-white uppercase text-sm px-8 py-3 min-w-[200px] rounded-sm ' onClick={handleClickOpen}>SUBMIT</button>
                                <UploadDialog open={open} handleClose={handleClose} />
                            </div>
                        </div>
                        <div className="flex-[2]">
                            <div className="border mt-[18px] mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px]" > Critical Dates</div>
                                <div className="bg-[#F4FCFD] px-4 py-5 date-picker">
                                    <DynamicDatePicker labels={datePickerLabels} />
                                </div>
                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between items-center" >
                                    <span>Assign to</span>
                                    <span className='text-[#00AAEC] text-sm uppercase flex gap-1 items-center' >Reassign</span>
                                </div>
                                <div className="bg-[#F8FAFB] flex flex-col gap-3 py-4 px-6 rounded-b-md items-center w-full">
                                    <PopupInput label={"Assign to"} className="w-full" />
                                    <BidDialog openBid={openContactAssign} handleBidClose={handlCloseContact} onYesButtonClick={onYesButtonClick} />
                                </div>

                            </div>
                            <div className="border mb-3 rounded-md">
                                <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between items-center" >
                                    <span>Key Contacts</span>
                                </div>
                                <div className="bg-[#F8FAFB] flex flex-col gap-3 py-4 px-6 rounded-b-md items-center w-full">
                                    <PopupInput label={"Order Issuer"} className="w-full" />
                                    <BidDialog openBid={openContactAssign} handleBidClose={handlCloseContact} />
                                </div>
                                <div className="bg-[#F8FAFB] flex flex-col gap-3 py-4 px-6 rounded-b-md items-center w-full">
                                    <PopupInput label={"Order Technical Contact"} className="w-full" />
                                    <BidDialog openBid={openContactAssign} handleBidClose={handlCloseContact} />
                                </div>

                            </div>
                        </div>
                    </div>}
                    {orderDetail &&
                        <div className="flex gap-6">
                            <div className="flex flex-[3] flex-col">
                            <div className=" flex items-center gap-1 text-[#00AAEC] cursor-pointer" onClick={() => { setOrderDetail(false); setOrderTable(true) }}>
                                <FaChevronLeft />
                                <span>  Back to List</span>
                            </div>
                                <p className='text-xl p-2'>{bidClarificationSelectedRow.title}</p>
                                <div className="flex flex-col-reverse">
                                    <div className="border mb-3 rounded-md ">
                                        <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                            <p>#001</p>
                                            <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                        </div>
                                        <div className="bg-[#F4F5F6] p-6 flex flex-col gap-5">
                                            <p>{bidClarificationSelectedRow.description}</p>
                                            <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                            {bidClarificationDocuments.map((doc, index) => (<div className="bg-[#E8ECEF] shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                {
                                                    ['jpg', 'jpeg', 'png'].some(ext => doc.file_type.includes(ext))

                                                        ?
                                                        <FaRegFileImage className='text-red-600' />
                                                        :
                                                        <FaRegFilePdf className='text-red-600' />
                                                }
                                                <span className=''>{doc.docvalt_filename}</span>
                                                <span className='text-[#98A9BC]'>{doc.file_size}</span>
                                                <span className='text-[#98A9BC]'>{doc.created_on}</span>
                                                <div className="flex items-center gap-2">
                                                    <span><Image src="/msg.svg" width={18} height={21} alt='messages' /></span>
                                                    <BsThreeDots className='text-[#98A9BC]' />
                                                </div>

                                            </div>))}
                                            {!showBidClarReply && <button className='bg-[#26BADA] p-3 max-w-[200px] text-white rounded-sm' onClick={setShowBidClarReply(true)}>REPLY</button>
                                            }                                    </div>
                                    </div>
                                    {/* <div className="border mb-3 rounded-md ">
                                        <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                            <p>#002</p>
                                            <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                        </div>
                                        <div className="bg-white p-6 flex flex-col gap-5">
                                            <p>{bidClarificationSelectedRow.description}</p>
                                            <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                            <div className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                <FaRegFilePdf className='text-red-600' />
                                                <span className=''>102345-CCL-01.xlxs</span>
                                                <span className='text-[#98A9BC]'>123kb</span>
                                                <span className='text-[#98A9BC]'>23 Jun 2020</span>
                                                <div className="flex items-center gap-2 text-[#98A9BC]">
                                                    <MdOutlineModeEdit className='cursor-pointer' />
                                                    <RiDeleteBin6Line className='cursor-pointer' />
                                                    <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='messages' /></span>
                                                    <BsThreeDots className='cursor-pointer' />
                                                </div>

                                            </div>
                                            <div className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]" >
                                                <FaRegFileImage className='text-[#00AAEC]' />
                                                <span className=''>ScreenShot.png</span>
                                                <span className='text-[#98A9BC]'>123kb</span>
                                                <span className='text-[#98A9BC]'>23 Jun 2020</span>
                                                <div className="flex items-center gap-2 text-[#98A9BC]">
                                                    <MdOutlineModeEdit className='cursor-pointer' />
                                                    <RiDeleteBin6Line className='cursor-pointer' />
                                                    <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='message' /></span>
                                                    <BsThreeDots className='cursor-pointer' />
                                                </div>

                                            </div>
                                        </div>
                                    </div> */}
                                    {messagesBidClar.map((message, index) => (
                                        <div className="border mb-3 rounded-md " key={index}>
                                            <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] flex justify-between " >
                                                <p>#00{index}</p>
                                                <p>Posted by <span className='text-[#00AAEC]'>Ravi K.</span> on 23 Jun 2021, 12:30</p>
                                            </div>
                                            <div className="bg-white p-6 flex flex-col gap-5">
                                                <p>{message.text}</p>
                                                {message.files.length > 0 && (
                                                    <p className='text-[#778CA2] mt-3'>Attached Documents</p>
                                                )}
                                                {message.files.map((file, fileIndex) => (
                                                    <div key={fileIndex} className="shadow-sm flex items-center w-full p-2 justify-between mb-3 border-b border-[#babec2]">
                                                        {file.type === 'image/png' ? <FaRegFileImage className='text-[#00AAEC]' /> : <FaRegFilePdf className='text-red-600' />}
                                                        <span className=''>{file.name}</span>
                                                        <span className='text-[#98A9BC]'>{file.size}kb</span>
                                                        <span className='text-[#98A9BC]'>{file.lastModifiedDate}</span>
                                                        <div className="flex items-center gap-2 text-[#98A9BC]">
                                                            <MdOutlineModeEdit className='cursor-pointer' />
                                                            <RiDeleteBin6Line className='cursor-pointer' />
                                                            <span><Image src="/msg.svg" width={18} height={21} className='cursor-pointer' alt='message' /></span>
                                                            <BsThreeDots className='cursor-pointer' />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                {showBidClarReply && (
                                    <div className="flex flex-col gap-[18px]">
                                        <textarea
                                            className='w-full border border-[#E8ECEF] outline-none p-2 rounded-md'
                                            placeholder='Description'
                                            rows={4}
                                            value={replyMessageBidClar}
                                            onChange={(e) => setReplyMessageBidClar(e.target.value)}
                                        ></textarea>
                                        <DragDrop onFileUpload={handleFileUpload} />
                                        <button
                                            className='bg-[#26BADA] border border-[#26BADA] text-white uppercase text-sm px-8 py-3 max-w-[200px] rounded-sm ml-auto'
                                            onClick={handleReplySubmitBidClar}
                                        >
                                            SUBMIT REPLY
                                        </button>
                                    </div>
                                )}

                            </div>
                            <div className="flex-[2]">
                                <div className="border mb-3 rounded-md">
                                    <div className="bg-[#00000005] py-2 px-[14px] text-[#778CA2] " >Status <span className='text-black'>{bidClarificationSelectedRow.status}</span></div>
                                    <div className="bg-[#c3eff92f] px-4 py-1 flex flex-col  ">
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Referrence #</span> <br />
                                                <span>{bidClarificationSelectedRow.reference_num}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Type</span> <br />
                                                <span>{bidClarificationSelectedRow.type}</span>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex items-center justify-between w-full p-4">
                                            <div>
                                                <span className='text-[#778CA2]'>Issue Date</span> <br />
                                                <span>{bidClarificationSelectedRow.issued_date}</span>
                                            </div>
                                            <div>
                                                <span className='text-[#778CA2]'>Due Date</span> <br />
                                                <span>{bidClarificationSelectedRow.due_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div key={222} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                    <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                        <Image src={bidClarificationAssignTo.user_profile_photo ? bidClarificationAssignTo.user_profile_photo : '/avatar.jpg'} alt={bidClarificationAssignTo.first_name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                        <div>
                                            <span className="text-sm leading-4">{bidClarificationAssignTo.first_name} {bidClarificationAssignTo.last_name}</span>
                                            <span className="text-sm leading-4 text-[#778CA2] block">{bidClarificationAssignTo.designation_title}</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                </div>
                                {/*selectedUsers && selectedUsers.length > 0 ? (
                                    selectedUsers.map((user, index) => (
                                        <div key={index} className="bg-[#F4F5F6] py-3 px-4 flex items-center justify-between">
                                            <div className="flex flex-[3] bg-white border rounded-[30px] p-1 gap-2 items-center max-w-[60%] w-full">
                                                <Image src={user.image} alt={user.name} width={38} height={38} className="rounded-[100%] object-cover w-[38px] h-[38px]" />
                                                <div>
                                                    <span className="text-sm leading-4">{user.name}</span>
                                                    <span className="text-sm leading-4 text-[#778CA2] block">{user.role}</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#26BADA] h-max rounded-md text-xs text-white p-1 min-w-[80px] text-center">Requester</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-lg text-[#FFAB2B] text-center p-3">No Contact Selected</p>

                                )*/}
                            </div>
                        </div>
                    }
                </div>}
            </div>

        </>
    )
}

export default RfxDetail
