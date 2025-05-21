from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

#creating a user
class UserCreate(BaseModel):
    email: EmailStr
    password: str

#read user data
class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True 

#login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

#tokens
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 