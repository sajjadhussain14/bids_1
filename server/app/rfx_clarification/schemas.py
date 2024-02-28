from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class RfxClarificationCreate(BaseModel):
    rfx_id: int
    submitted_by: int
    assign_to: int
    rfx_clarification_ref_num: Optional[str]
    clarification_title: str
    clarification_type: str
    clarification_issued_date: date
    clarification_due_date: date
    status: str

class RfxClarification(RfxClarificationCreate):
    rfx_clarification_id: int
