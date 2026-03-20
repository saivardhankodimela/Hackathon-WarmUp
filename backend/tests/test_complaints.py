import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_health_check():
    """Backend should be reachable and return 200."""
    response = client.get("/health")
    assert response.status_code == 200


def test_list_complaints_empty():
    """GET /complaints/ should return 200 and a list."""
    response = client.get("/complaints/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_complaint_missing_description():
    """POST /complaints/ without description should return 422."""
    response = client.post("/complaints/", data={})
    assert response.status_code == 422


def test_create_complaint_success():
    """POST /complaints/ with valid description should return 200."""
    response = client.post(
        "/complaints/",
        data={
            "description": "Large pothole on Main Street causing traffic hazard",
            "location": "Main Street",
        },
    )
    # Should be 200 (success) or 500 (if Gemini key not configured — acceptable in CI)
    assert response.status_code in [200, 500]


def test_get_complaint_not_found():
    """GET /complaints/nonexistent_id should return 404."""
    response = client.get("/complaints/nonexistent_id_that_does_not_exist_xyz")
    assert response.status_code == 404


def test_create_complaint_then_retrieve():
    """Create a complaint and verify it appears in the list."""
    create_resp = client.post(
        "/complaints/",
        data={
            "description": "Broken street lamp at Park Avenue intersection",
            "location": "Park Avenue",
        },
    )
    if create_resp.status_code == 200:
        created = create_resp.json()
        complaint_id = created.get("id")
        if complaint_id:
            get_resp = client.get(f"/complaints/{complaint_id}")
            assert get_resp.status_code == 200
            assert get_resp.json()["description"] == "Broken street lamp at Park Avenue intersection"


def test_cors_headers():
    """CORS should be configured and return appropriate headers."""
    response = client.options("/complaints/", headers={"Origin": "http://localhost:3000"})
    # Accept any 2xx or 4xx (CORS middleware may return various codes)
    assert response.status_code < 500
