from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class BidOrderCreate(BaseModel):
    rfx_id: int
    assign_to: Optional[int]
    acknowledged_by: Optional[int]
    acknowledgement_document: Optional[int]
    bid_order_num: Optional[str]
    title: Optional[str]
    currency: Optional[str]
    order_value: Optional[Decimal]
    description: Optional[str]
    issued_date: date
    delivery_date: date
    acknowledgement_deadline: date
    acknowledgement_comment: Optional[str]
    acknowledgement_date: date
    acknowledged_on: date
    acknowledged: Optional[bool]
    order_complete: Optional[bool]

class BidOrder(BidOrderCreate):
    bid_order_id: int
