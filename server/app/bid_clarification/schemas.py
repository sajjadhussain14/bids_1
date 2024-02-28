from pydantic import BaseModel
from typing import Optional
from datetime import date

class BidClarificationCreate(BaseModel):
    rfx_id: int
    submitted_to: int
    assigned_to: int
    title: Optional[str]
    type: Optional[str]
    issued_date: date
    due_date: date
    status: Optional[str]
    reference_num: Optional[str]
    completed: Optional[bool] = False
    completed_date: date

class BidClarification(BidClarificationCreate):
    bid_clarification_id: int
