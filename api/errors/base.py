class AppError(Exception):
    """Base application error with HTTP status code."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code


class TemplateNotFoundError(AppError):
    """Raised when a requested template does not exist."""

    def __init__(self, template_id: int):
        super().__init__(f"Template {template_id} not found", status_code=404)


class FormNotFoundError(AppError):
    """Raised when a requested form submission does not exist."""

    def __init__(self, form_id: int):
        super().__init__(f"Form submission {form_id} not found", status_code=404)


class OllamaUnavailableError(AppError):
    """Raised when the Ollama LLM service is unreachable."""

    def __init__(self, url: str):
        super().__init__(
            f"Could not connect to Ollama at {url}. "
            "Please ensure Ollama is running and accessible.",
            status_code=503,
        )


class ExtractionValidationError(AppError):
    """Raised when LLM output fails schema validation."""

    def __init__(self, details: str):
        super().__init__(
            f"Extraction validation failed: {details}", status_code=422
        )


class PDFWriteError(AppError):
    """Raised when writing a filled PDF to disk fails."""

    def __init__(self, path: str, reason: str = ""):
        msg = f"Failed to write PDF to {path}"
        if reason:
            msg += f": {reason}"
        super().__init__(msg, status_code=500)