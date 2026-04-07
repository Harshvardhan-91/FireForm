import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlmodel import Session
from api.deps import get_db
from api.schemas.forms import FormFill, FormFillResponse
from api.db.repositories import create_form, get_template
from api.db.models import FormSubmission
from api.errors.base import AppError
from src.controller import Controller

router = APIRouter(prefix="/forms", tags=["forms"])


@router.post("/fill", response_model=FormFillResponse)
def fill_form(form: FormFill, db: Session = Depends(get_db)):
    template = get_template(db, form.template_id)
    if not template:
        raise AppError("Template not found", status_code=404)

    controller = Controller()
    path = controller.fill_form(
        user_input=form.input_text,
        fields=template.fields,
        pdf_form_path=template.pdf_path,
    )

    submission = FormSubmission(**form.model_dump(), output_pdf_path=path)
    return create_form(db, submission)


@router.get("/{form_id}/download")
def download_form(form_id: int, db: Session = Depends(get_db)):
    """Download the filled PDF for a given form submission."""
    submission = db.get(FormSubmission, form_id)
    if not submission:
        raise AppError("Form submission not found", status_code=404)

    if not os.path.exists(submission.output_pdf_path):
        raise AppError("Output PDF file not found on disk", status_code=404)

    return FileResponse(
        path=submission.output_pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(submission.output_pdf_path),
    )


