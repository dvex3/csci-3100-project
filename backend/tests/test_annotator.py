import pytest
from openai import AzureOpenAI
from annotator.api.annotation.util import get_user_prompt, chat
from unittest.mock import patch, MagicMock





def test_get_user_prompt():
    function_name = "my_function"
    parsed_map = {"key1": "value1", "key2": "value2"}
    result = get_user_prompt(function_name, parsed_map)
    assert result == f"Explain function: {function_name} in code map: {parsed_map} "



@patch("annotator.api.annotation.util.get_client")
def test_chat_mocked_api(mock_azure_client):
    """
    Test the chat() function using mocked AzureOpenAI client,
    so no real API calls are made.
    """

    # ---- Arrange ----
    # Create a fake response object that mimics what OpenAI returns
    mock_response = MagicMock()
    mock_choice = MagicMock()
    mock_choice.message.content = "Mocked explanation of function"
    mock_response.choices = [mock_choice]

    # Mock the client's chat.completions.create() chain
    mock_client_instance = MagicMock()
    mock_client_instance.chat.completions.create.return_value = mock_response

    # Make AzureOpenAI() return our mock client
    mock_azure_client.return_value = mock_client_instance

    # Inputs
    function_name = "my_func"
    code_map = {"my_func": "some code"}

    # ---- Act ----
    reply = chat(function_name, code_map)

    # ---- Assert ----
    assert reply == "Mocked explanation of function"

    # Verify the client was created
    mock_azure_client.assert_called_once()

    # Verify chat.completions.create() was called with expected params
    mock_client_instance.chat.completions.create.assert_called_once()

    # Optional: check message contents
    called_args = mock_client_instance.chat.completions.create.call_args[1]
    messages = called_args["messages"]

    assert messages[0]["role"] == "system"
    assert "code annotator" in messages[0]["content"]
    assert messages[1]["role"] == "user"
    assert "Explain function: my_func" in messages[1]["content"]







