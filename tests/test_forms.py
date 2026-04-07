"""Tests for the /forms API endpoints."""

import pytest


def test_fill_form_template_not_found(client):
    """POST /forms/fill should return 404 when template does not exist."""
    payload = {
        "template_id": 99999,
        "input_text": "Incident at 123 Main St involving two units.",
    }
    response = client.post("/forms/fill", json=payload)
    assert response.status_code == 404
    assert "not found" in response.json()["error"].lower()


def test_fill_form_missing_input_text(client):
    """POST /forms/fill should return 422 when input_text is missing."""
    payload = {"template_id": 1}
    response = client.post("/forms/fill", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_fill_form_missing_template_id(client):
    """POST /forms/fill should return 422 when template_id is missing."""
    payload = {"input_text": "Some incident happened."}
    response = client.post("/forms/fill", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_download_form_not_found(client):
    """GET /forms/{id}/download should return 404 for non-existent submission."""
    response = client.get("/forms/99999/download")
    assert response.status_code == 404
    assert "not found" in response.json()["error"].lower()
