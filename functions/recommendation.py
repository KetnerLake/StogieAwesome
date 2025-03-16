import os
from google import genai
from google.genai import types

GEMINI_API_KEY = "_MY_GEMINI_API_KEY_HERE_"
# genai.configure( api_key = os.environ["GEMINI_API_KEY"] )

favorites = ["CAO", "Nica", "and Charter"]
favorites = ', '.join( map( str, favorites ) ) 
message = "Cigars I like include #. Provide three cigar recommendations that are similar. Provide a URL to a photo in the \"photo\" field. Provide a description of the cigar in the \"description\" field. Provide the body (also known as the flavor profile or strength) in the \"body\" field. Provide the length in inches in the \"length\" field. Provide the ring gauge (also known as just gauge) in the \"gauge\" field. Provide an estimated price the \"price\" field. Provide the country of origin in the \"country\" field. Provide the type of wrapper leaf in the \"wrapper\" field."
message = message.replace( "#", favorites )
print( message )


client = genai.Client( api_key = GEMINI_API_KEY )
response = client.models.generate_content(
  model = "gemini-2.0-flash", 
  contents = message,
  config = types.GenerateContentConfig(
    max_output_tokens = 1000,
    temperature = 1,
    top_p = 0.95,
    top_k = 40,
    response_mime_type = "application/json"
  )
)

#print( response.text )


'''
aws bedrock-runtime invoke-model \
--model-id anthropic.claude-3-5-sonnet-20241022-v2:0 \
--body "{\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"Cigars I like include Nica Rustica, CAO Flathead, and Liga Privada. Provide three cigar recommendations that are similar. Provide the result as a JSON array. Provide a description of the cigar in the \\\"description\\\" field. Provide the body (also known as the flavor profile or strength) in the \\\"body\\\" field. Provide the length in inches in the \\\"length\\\" field. Provide the ring gauge (also known as just gauge) in the \\\"gauge\\\" field. Provide an estimated price the \\\"price\\\" field. Provide the country of origin in the \\\"country\\\" field. Provide the type of wrapper leaf in the \\\"wrapper\\\" field.\"}]}],\"anthropic_version\":\"bedrock-2023-05-31\",\"max_tokens\":2000,\"temperature\":1,\"top_k\":250,\"top_p\":0.999,\"stop_sequences\":[]}" \
--cli-binary-format raw-in-base64-out \
--performance-config-latency standard \
--region us-west-2 \
invoke-model-output.txt'
'''

'''
# Use the native inference API to send a text message to Anthropic Claude.

import boto3
import json

from botocore.exceptions import ClientError

# Create a Bedrock Runtime client in the AWS Region of your choice.
client = boto3.client("bedrock-runtime", region_name="us-east-1")

# Set the model ID, e.g., Claude 3 Haiku.
model_id = "anthropic.claude-3-haiku-20240307-v1:0"

# Define the prompt for the model.
prompt = "Describe the purpose of a 'hello world' program in one line."

# Format the request payload using the model's native structure.
native_request = {
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 512,
    "temperature": 0.5,
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": prompt}],
        }
    ],
}

# Convert the native request to JSON.
request = json.dumps(native_request)

try:
    # Invoke the model with the request.
    response = client.invoke_model(modelId=model_id, body=request)

except (ClientError, Exception) as e:
    print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
    exit(1)

# Decode the response body.
model_response = json.loads(response["body"].read())

# Extract and print the response text.
response_text = model_response["content"][0]["text"]
print(response_text)
'''