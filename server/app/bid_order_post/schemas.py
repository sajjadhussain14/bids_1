from pydantic import BaseModel
from typing import Optional
from datetime import date

class BidOrderPostCreate(BaseModel):
    rfx_id: int
    bid_order_id: int
    post_by: int
    comment: str
    post_on: date

class BidOrderPost(BidOrderPostCreate):
    order_post_id: int
