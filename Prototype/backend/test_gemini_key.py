import google.generativeai as genai
genai.configure(api_key="AIzaSyAFu2lWw35U4OdAeWvlvwR4TDnc0xBntXk")
# for m in genai.list_models():
#     print(m.name)
#from google import genai

# The client gets the API key from the environment variable `GEMINI_API_KEY`.

# import google.generativeai as genai

# genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel("models/gemini-2.5-flash")
response = model.generate_content("Explain how AI works in a few words")
print(response.text)