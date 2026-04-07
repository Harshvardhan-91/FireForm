"""Unit tests for src/llm.py — LLM prompt building and response parsing."""

import pytest
from src.llm import LLM


class TestBuildPrompt:
    """Tests for LLM.build_prompt()."""

    def test_prompt_contains_field_name(self):
        llm = LLM(transcript_text="Test input", target_fields={"Name": ""})
        prompt = llm.build_prompt("Name")
        assert "Name" in prompt

    def test_prompt_contains_transcript(self):
        transcript = "The employee is John Doe."
        llm = LLM(transcript_text=transcript, target_fields={"Name": ""})
        prompt = llm.build_prompt("Name")
        assert transcript in prompt

    def test_prompt_contains_system_instructions(self):
        llm = LLM(transcript_text="test", target_fields={"Name": ""})
        prompt = llm.build_prompt("Name")
        assert "SYSTEM PROMPT" in prompt
        assert "JSON" in prompt


class TestAddResponseToJson:
    """Tests for LLM.add_response_to_json()."""

    def test_adds_simple_value(self):
        llm = LLM(json={})
        llm.add_response_to_json("name", "John Doe")
        assert llm._json["name"] == "John Doe"

    def test_strips_whitespace(self):
        llm = LLM(json={})
        llm.add_response_to_json("name", "  John Doe  ")
        assert llm._json["name"] == "John Doe"

    def test_removes_quotes(self):
        llm = LLM(json={})
        llm.add_response_to_json("name", '"John Doe"')
        assert llm._json["name"] == "John Doe"

    def test_negative_one_returns_none(self):
        llm = LLM(json={})
        llm.add_response_to_json("name", "-1")
        assert llm._json["name"] is None

    def test_plural_values_semicolon(self):
        llm = LLM(json={})
        llm.add_response_to_json("units", "Engine 1; Ladder 4; Rescue 7")
        assert isinstance(llm._json["units"], list)
        assert len(llm._json["units"]) == 3


class TestHandlePluralValues:
    """Tests for LLM.handle_plural_values()."""

    def test_splits_on_semicolon(self):
        llm = LLM()
        result = llm.handle_plural_values("A; B; C")
        assert result == ["A", "B", "C"]

    def test_raises_on_no_semicolon(self):
        llm = LLM()
        with pytest.raises(ValueError, match="not plural"):
            llm.handle_plural_values("just a single value")


class TestTypeCheckAll:
    """Tests for LLM.type_check_all()."""

    def test_valid_types_no_error(self):
        llm = LLM(transcript_text="hello", target_fields=["field1"])
        llm.type_check_all()  # Should not raise

    def test_invalid_transcript_raises(self):
        llm = LLM(transcript_text=12345, target_fields=["field1"])
        with pytest.raises(TypeError):
            llm.type_check_all()

    def test_invalid_fields_raises(self):
        llm = LLM(transcript_text="hello", target_fields="not a list")
        with pytest.raises(TypeError):
            llm.type_check_all()


class TestGetData:
    """Tests for LLM.get_data()."""

    def test_returns_json_dict(self):
        data = {"name": "John", "title": "Director"}
        llm = LLM(json=data)
        assert llm.get_data() == data

    def test_empty_default(self):
        llm = LLM()
        assert llm.get_data() == {}
