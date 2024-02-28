from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class UserIn(BaseModel):
    tenant_id: Optional[int]
    team_id: Optional[int]
    designation_id: Optional[int]
    company_id: Optional[int]
    user_name: str
    email: EmailStr
    password: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    user_role: str
    role_level: str
    registration_date: Optional[date]
    last_login_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    active: Optional[bool] = False
    verified: Optional[bool] = False
    password_salt: Optional[str]
    user_profile_photo: Optional[str]

class UserOut(BaseModel):
    user_id: Optional[int]
    tenant_id: Optional[int]
    team_id: Optional[int]
    designation_id: Optional[int]
    company_id: Optional[int]
    user_name: str
    email: str
    first_name: str
    middle_name: Optional[str]
    last_name: str
    user_role: str
    role_level: str
    registration_date: Optional[date]
    last_login_at: Optional[datetime]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    active: Optional[bool] = False
    verified: Optional[bool] = False
    user_profile_photo: Optional[str]
