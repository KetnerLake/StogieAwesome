import boto3
import json

def lambda_handler( event, context ):
    favorites = []

    for cigar in event:
        favorites.append( cigar["name"] )

    favorites[len(favorites) - 1] = "and " + favorites[len(favorites) - 1]
    favorites = ', '.join( map( str, favorites ) ) 

    prompt = "Cigars I like include #. Provide three cigar recommendations that are similar. Provide the output in JSON format. Provide a description of the cigar in the \"description\" field. Provide the body (also known as the flavor profile or strength) in the \"body\" field. Provide the length in inches in the \"length\" field. Provide the ring gauge (also known as just gauge) in the \"gauge\" field. Provide an estimated price the \"price\" field. Provide the country of origin in the \"country\" field. Provide the type of wrapper leaf in the \"wrapper\" field."
    prompt = prompt.replace( "#", favorites )

    client = boto3.client( service_name = "bedrock-runtime" )
    model_id = "anthropic.claude-3-5-haiku-20241022-v1:0"
    messages = [{"role": "user", "content": prompt}]

    # anthropic.claude-3-5-haiku-20241022-v1:0
    # anthropic.claude-3-5-sonnet-20241022-v2:0

    request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "temperature": 1,
        "messages": messages
    }
    response = client.invoke_model( modelId = model_id, body = json.dumps( request ) )
    
    model_response = json.loads( response["body"].read() )

    response_text = model_response["content"][0]["text"]

    return {
        "favorites": event,
        "recommendations": json.loads( response_text )["recommendations"]
    }
