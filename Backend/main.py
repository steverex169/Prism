from fastapi import FastAPI
from dotenv import load_dotenv
import os
from Endpoint.Hero_endpoint import router as hero_endpoint
from Endpoint.Email_endpoint import router as email_endpoint
from fastapi.middleware.cors import CORSMiddleware
from Endpoint.User_endpoint import router as user_endpoint
from fastapi.staticfiles import StaticFiles

load_dotenv()

app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Mount uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://prisimwellness.com",
        "https://www.prisimwellness.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hero_endpoint)
app.include_router(email_endpoint)
app.include_router(user_endpoint)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST"), port=int(os.getenv("PORT")))