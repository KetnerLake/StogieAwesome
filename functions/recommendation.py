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
