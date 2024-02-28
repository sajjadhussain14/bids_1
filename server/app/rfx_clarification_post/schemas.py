from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RfxClarificationPostCreate(BaseModel):
    rfx_clarification_id: int
    posted_by: int
    post_number: int
    posted_on: datetime
    title: str
    comment: str

class RfxClarificationPost(RfxClarificationPostCreate):
    rfx_clarification_post_id: int
