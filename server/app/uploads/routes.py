# routes.py

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Header
from fastapi.responses import JSONResponse, FileResponse
from .services import get_upload_folder, save_file, get_file_path
from typing import List
import os
from .services import download_file

router = APIRouter()

@router.post("/upload/",  summary="Method to upload files.")
async def upload_files(
    files: List[UploadFile] = File(...),
    tenantID: str = Header(..., description="Tenant ID"),
    docvaltKey: str = Header(..., description="DocValt Key")
):
    folder = get_upload_folder(tenantID, docvaltKey)
    file_responses = []
    for file in files:
        file_path = save_file(file, folder)
        file_responses.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "file_path": file_path
        })

    return JSONResponse(content={"files": file_responses}, status_code=200)


@router.get("/download/",  summary="Method to download files.")
async def download_file_route(
    tenantID: str = Header(..., description="Tenant ID"),
    docvaltKey: str = Header(..., description="DocValt Key"),
    file_name: str = Header(..., description="File Name")
):
    return download_file(tenantID, docvaltKey, file_name)
