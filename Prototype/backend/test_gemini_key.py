import google.generativeai as genai
genai.configure(api_key="AIzaSyAFu2lWw35U4OdAeWvlvwR4TDnc0xBntXk")
for m in genai.list_models():
    print(m.name)