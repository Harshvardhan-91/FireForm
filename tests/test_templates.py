"""Tests for the /templates API endpoints."""


def test_create_template(client):
    """POST /templates/create should persist and return a template."""
    payload = {
        "name": "Template 1",
        "pdf_path": "src/inputs/file.pdf",
        "fields": {
            "Employee's name": "string",
            "Employee's job title": "string",
            "Employee's department supervisor": "string",
            "Employee's phone number": "string",
            "Employee's email": "string",
            "Signature": "string",
            "Date": "string",
        },
    }

    response = client.post("/templates/create", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["name"] == "Template 1"
    assert data["id"] is not None
    assert "fields" in data


def test_list_templates(client):
    """GET /templates/ should return all registered templates."""
    # Create two templates first
    for i in range(2):
        client.post("/templates/create", json={
            "name": f"List Test Template {i}",
            "pdf_path": "src/inputs/file.pdf",
            "fields": {"field_a": "string"},
        })

    response = client.get("/templates/")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  # At least the two we just created


def test_get_template_by_id(client):
    """GET /templates/{id} should return a single template."""
    create_resp = client.post("/templates/create", json={
        "name": "Get By ID Template",
        "pdf_path": "src/inputs/file.pdf",
        "fields": {"field_x": "string"},
    })
    template_id = create_resp.json()["id"]

    response = client.get(f"/templates/{template_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Get By ID Template"


def test_get_template_not_found(client):
    """GET /templates/{id} should return 404 for non-existent template."""
    response = client.get("/templates/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"].lower()


def test_delete_template(client):
    """DELETE /templates/{id} should remove the template."""
    create_resp = client.post("/templates/create", json={
        "name": "Delete Me Template",
        "pdf_path": "src/inputs/file.pdf",
        "fields": {"field_y": "string"},
    })
    template_id = create_resp.json()["id"]

    # Delete it
    del_resp = client.delete(f"/templates/{template_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["success"] is True

    # Verify it's gone
    get_resp = client.get(f"/templates/{template_id}")
    assert get_resp.status_code == 404


def test_delete_template_not_found(client):
    """DELETE /templates/{id} should return 404 for non-existent template."""
    response = client.delete("/templates/99999")
    assert response.status_code == 404
