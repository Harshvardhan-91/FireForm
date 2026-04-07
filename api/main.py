import os

from fastapi import FastAPI
<<<<<<< Updated upstream
from fastapi.middleware.cors import CORSMiddleware

from api.routes import forms, templates
=======
from api.routes import templates, forms
from api.errors.handlers import register_exception_handlers
>>>>>>> Stashed changes

app = FastAPI(
    title="FireForm API",
    description="Report Once, File Everywhere — AI-powered form filling for first responders",
    version="0.1.0",
)

# Register custom exception handlers
register_exception_handlers(app)

default_origins = "http://127.0.0.1:5173"
allowed_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(templates.router)
app.include_router(forms.router)
