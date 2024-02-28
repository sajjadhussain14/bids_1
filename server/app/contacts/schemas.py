from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class ContactsCreate(BaseModel):
    tenant_id: int
    rfx_id: int
    contact_user_id: int
    conatct_key: Optional[str]
    created_date: Optional[date]
    created_at: Optional[datetime]

class Contacts(ContactsCreate):
    contact_id: int