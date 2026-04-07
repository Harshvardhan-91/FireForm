"""Unit tests for the error handling system."""

from fastapi.testclient import TestClient
from api.main import app
from api.errors.base import (
    AppError,
    TemplateNotFoundError,
    FormNotFoundError,
    OllamaUnavailableError,
    ExtractionValidationError,
    PDFWriteError,
)


class TestErrorClasses:
    """Verify all custom error classes carry correct status codes."""

    def test_app_error_defaults(self):
        err = AppError("something broke")
        assert err.message == "something broke"
        assert err.status_code == 400

    def test_template_not_found(self):
        err = TemplateNotFoundError(42)
        assert err.status_code == 404
        assert "42" in err.message

    def test_form_not_found(self):
        err = FormNotFoundError(7)
        assert err.status_code == 404
        assert "7" in err.message

    def test_ollama_unavailable(self):
        err = OllamaUnavailableError("http://localhost:11434")
        assert err.status_code == 503
        assert "Ollama" in err.message

    def test_extraction_validation(self):
        err = ExtractionValidationError("missing field: date")
        assert err.status_code == 422
        assert "date" in err.message

    def test_pdf_write_error(self):
        err = PDFWriteError("/tmp/out.pdf", "disk full")
        assert err.status_code == 500
        assert "disk full" in err.message


class TestExceptionHandlerRegistered:
    """Verify that the error handler is actually registered in the app."""

    def test_app_error_returns_json(self):
        """Hitting a 404 endpoint that raises AppError should return JSON, not 500."""
        client = TestClient(app)
        response = client.get("/templates/99999")
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
