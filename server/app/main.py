from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from auth.services import   authenticate_user, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from admin.control_panel.routes import router as control_panel_router
from auth.routes import router as auth_router 

from admin.designation.routers import router as designation_router
from admin.company.routers import router as company_router
from admin.team.routers import router as team_router
from admin.customer.routers import router as customer_router

from docvalt.routes import router as docvalt_router
from opportunity.routes import router as opportunity_router

from bid_validity.routes import router as bid_validity_router
from rfx_type.routes import router as rfx_type_router
from rfx_content_submission.routes import router as rfx_content_submission_router
from rfx_submission_mode.routes import router as rfx_submission_mode_router
from rfx_stage.routes import router as rfx_stage_router


from rfx.routes import router as rfx_router

#from rfx_phase_stage.routes import router as rfx_phase_stage_router
#from rfx_phase_stage_detail.routes import router as rfx_phase_stage_detail_stage_router

from bid_stage.routes import router as bid_stage_router
#from bid_stage_detail.routes import router as bid_stage_detail_stage_router

from rfx_clarification.routes import router as rfx_clarification_router
from rfx_clarification_post.routes import router as rfx_clarification_post_router
from rfx_clarification_meta.routes import router as rfx_clarification_meta_router
from bid_documents.routes import router as bid_documents_router

from bid_documents_post.routes import router as bid_documents_post_router
from bid_documents_meta.routes import router as bid_documents_meta_router
from bid_clarification.routes import router as bid_clarification_router
from bid_clarification_meta.routes import router as bid_clarification_meta_router
from bid_clarification_revision.routes import router as bid_clarification_revision_router
from bid_clarification_revision_line.routes import router as bid_clarification_revision_line_router
from bid_clarification_revision_meta.routes import router as bid_clarification_revision_meta_router
from bid_order.routes import router as bid_order_router
from bid_order_post.routes import router as bid_order_post_router
from bid_order_meta.routes import router as bid_order_meta_router

from contacts.routes import router as contacts_router

from fastapi.responses import RedirectResponse

from core.config import settings

from uploads.routes import router as uploads_router

import os
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import FastAPI, UploadFile, File, HTTPException
from urllib.parse import quote
from fastapi.responses import StreamingResponse
from botocore.exceptions import NoCredentialsError, ClientError


app = FastAPI(
    debug=True,
    title=settings.PROJECT_NAME, 
    version=settings.PROJECT_VERSION,
    summary="The APIs designed for BIDSFORCE, an innovative bid management platform. These APIs cover authentication, CRUD operations, and management functionalities, aiming to streamline bid planning, workflow automation, and resource allocation.",
    description="A comprehensive set of APIs catering to BIDSFORCE, revolutionizing bid management practices. Spanning authentication with OAuth2 and JWT tokenization, CRUD operations for designations, companies, teams, customers, and DocValt, these APIs ensure secure, efficient, and organized bid processes. They encompass Opportunity and RFX management, bid lifecycle handling, resource allocation, and administrative control through a Control Panel. With detailed endpoint information and usage instructions, these APIs aim to enhance collaboration and deliver an intuitive user experience within the BIDSFORCE platform.",
    root_path_in_servers=True,
    include_in_schema=True,
    separate_input_output_schemas=True,
    )


origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)





# Define your AWS S3 bucket name
BUCKET_NAME = 'bidsforce-storage-bucket'

# Initialize boto3 S3 client
s3_client = boto3.client('s3')

@app.post("/upload/", tags=["aws"])
async def upload_file(file: UploadFile = File(...)):
    try:
        # Define the folder path within the bucket
        folder_path = 'document/rfx/123/'

        # Upload file to S3 bucket with the specified key (path within the bucket)
        s3_client.upload_fileobj(file.file, BUCKET_NAME, folder_path + file.filename)
        
        return {"message": "File uploaded successfully"}
    except NoCredentialsError:
        return {"error": "No AWS credentials found"}
    except Exception as e:
        return {"error": str(e)}


@app.get("/download/{filename}", tags=["aws"])
async def download_file(filename: str):
    try:
        # Trim any whitespace characters from the filename
        filename = filename.strip()

        # Define the folder path within the bucket
        folder_path = 'document/rfx/123/'

        # Encode the filename to handle special characters like spaces
        encoded_filename = quote(filename)

        # Construct the key for the file in S3 bucket
        file_path = folder_path + encoded_filename

        # Check if the file exists in S3 bucket by making a HEAD request
        s3_client.head_object(Bucket=BUCKET_NAME, Key=file_path)

        # Download file from S3 bucket directly into a file-like object
        with open(filename, 'wb') as f:
            s3_client.download_fileobj(BUCKET_NAME, file_path, f)

        # Return the file content as a streaming response
        return StreamingResponse(content=open(filename, 'rb'), media_type='application/octet-stream', headers={'Content-Disposition': f'attachment; filename="{filename}"'})
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="No AWS credentials found")
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            raise HTTPException(status_code=404, detail="File not found")
        else:
            raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/")
async def check_server():
    if "AWS_REGION" in os.environ and os.environ["AWS_REGION"]:
        return {"message": "Server is running on AWS"}
    else:
        return {"message": "Server is running locally"}



@app.get("/test-db")
async def test_db():
    return ""


app.include_router(auth_router, prefix="/auth")



app.include_router(designation_router, prefix="/designation")

app.include_router(company_router, prefix="/company")

app.include_router(team_router, prefix="/team")
app.include_router(customer_router, prefix="/customer")


app.include_router(docvalt_router, prefix="/docvalt")
app.include_router(opportunity_router, prefix="/opportunity")

app.include_router(bid_validity_router, prefix="/bid_validity")
app.include_router(rfx_type_router, prefix="/rfx_type")
app.include_router(rfx_content_submission_router, prefix="/rfx_content_submission")
app.include_router(rfx_submission_mode_router, prefix="/rfx_submission_mode")
app.include_router(rfx_stage_router, prefix="/rfx_stage")

app.include_router(rfx_router, prefix="/rfx")

#app.include_router(rfx_phase_stage_router, prefix="/rfx_phase_stage")
#app.include_router(rfx_phase_stage_detail_stage_router, prefix="/rfx_phase_stage_detail_stage")

app.include_router(bid_stage_router, prefix="/bid_stage")
#app.include_router(bid_stage_detail_stage_router, prefix="/bid_stage_detail_stage")

app.include_router(rfx_clarification_router, prefix="/rfx_clarification")
app.include_router(rfx_clarification_post_router, prefix="/rfx_clarification_post")
app.include_router(rfx_clarification_meta_router, prefix="/rfx_clarification_meta")
app.include_router(bid_documents_router, prefix="/bid_documents")
app.include_router(bid_documents_post_router, prefix="/bid_documents_post")
app.include_router(bid_documents_meta_router, prefix="/bid_documents_meta")
app.include_router(bid_clarification_router, prefix="/bid_clarification")
app.include_router(bid_clarification_meta_router, prefix="/bid_clarification_meta")
app.include_router(bid_clarification_revision_router, prefix="/bid_clarification_revision")
app.include_router(bid_clarification_revision_line_router, prefix="/bid_clarification_revision_line")
app.include_router(bid_clarification_revision_meta_router, prefix="/bid_clarification_revision_meta")
app.include_router(bid_order_router, prefix="/bid_order")
app.include_router(bid_order_post_router, prefix="/bid_order_post")
app.include_router(bid_order_meta_router, prefix="/bid_order_meta")

app.include_router(contacts_router, prefix="/contacts")






app.include_router(control_panel_router, prefix="/admin/control-panel") 


app.include_router(uploads_router, prefix="/uploads")


