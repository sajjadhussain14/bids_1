# services.py

import os
from typing import List
from pathlib import Path
from fastapi import UploadFile
from fastapi.responses import JSONResponse, FileResponse

def get_upload_folder(tenantID: str, docvaltKey: str):
    tenantID="tenant-"+tenantID
    if os.environ.get("ENVIRONMENT") == "production":
        # In a production environment (e.g., AWS S3), you might use specific bucket and folder structures
        # Replace "your-s3-bucket-name" with your actual S3 bucket name
        return os.path.join("s3:", "your-s3-bucket-name", "documents", tenantID, docvaltKey)
    else:
        # In a local development environment, create the folder locally
        return os.path.join("uploads", "documents", tenantID, docvaltKey)

def save_file(file: UploadFile, folder: str):
    if not os.path.exists(folder):
        os.makedirs(folder)  # Create the folder if it doesn't exist
    
    if file.filename:
        file_path = os.path.join(folder, file.filename)
        file_content = file.file.read()
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        return file_path

def get_file_path(filename: str, folder: str):
    return os.path.join(folder, filename)


def download_file(tenantID: str, docvaltKey: str, file_name: str):
    folder = get_upload_folder(tenantID, docvaltKey)
    file_path = get_file_path(file_name, folder)
    return FileResponse(file_path)
