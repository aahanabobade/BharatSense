from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import m01_backend, m02_backend

app = FastAPI(title="BharatSense API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(m01_backend.router)
app.include_router(m02_backend.router)