from openai import AzureOpenAI
import re

ROLE = """
When requested to write code, pick Python. 
When creating a function call it "main", it has to accept an array of args and returning a dictonary {"body": value}. 
When requested to show chess position, always use the FEN notation.
When showing HTML, always include what is in the body tag,
but exclude the code surrounding the actual content. 
So exclude always BODY, HEAD and HTML.
"""

ROLE = """
You are an AI assistant with specific instructions for handling code, chess positions, and HTML content. 
When requested to write code, always use Python. Name the function `main`, ensure it accepts an array of arguments (`args`), and make sure it returns a dictionary with the format `{"body": value}`.
When showing a chess position, always use the FEN Notation.
When displaying HTML content, include only what is inside the `<body>` tag, and exclude the `<body>`, `<head>`, and `<html>` tags and their contents. 
For example, if you are asked to "create a Fibonacci function", your response should look like this: \n\n
def main(args):\n\n    n = int(args.get("n"))\n\n    fib_seq = [0, 1]\n\n    if n <= 1:\n        return {"body": fib_seq[:n + 1]}\n\n    while len(fib_seq) <= n:\n        fib_seq.append(fib_seq[-1] + fib_seq[-2])\n\n    return {"body": fib_seq}

You can call this function with main([5]) to get the Fibonacci sequence up to the 5th number. This ensures the function meets the required format and output structure.
Follow these instructions consistently to provide accurate and expected results.
"""

MODEL = "gpt-35-turbo"
AI = None

def req(msg):
    return [{"role": "system", "content": ROLE}, 
            {"role": "user", "content": msg}]

def ask(input):
    comp = AI.chat.completions.create(model=MODEL, messages=req(input))
    if len(comp.choices) > 0:
        content = comp.choices[0].message.content
        return content
    return "ERROR"


"""
import re
from pathlib import Path
text = Path("util/test/chess.txt").read_text()
text = Path("util/test/html.txt").read_text()
text = Path("util/test/code.txt").read_text()
"""
def extract(text):
    res = {}
    
    # search for a chess position
    pattern = r'(([rnbqkpRNBQKP1-8]{1,8}/){7}[rnbqkpRNBQKP1-8]{1,8} [bw] (-|K?Q?k?q?) (-|[a-h][36]) \d+ \d+)'
    m = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
    #print(m)
    if len(m) > 0:
        res['chess'] = m[0][0]
        return res

    # search for code
    pattern = r"```(\w+)\n(.*?)```"
    m = re.findall(pattern, text, re.DOTALL)
    if len(m) > 0:
        if m[0][0] == "html":
            html = m[0][1]
            # extract the body if any
            pattern = r"<body.*?>(.*?)</body>"
            m = re.findall(pattern, html, re.DOTALL)
            if m:
                html = m[0]
            res['html'] = html
            return res
        res['language'] = m[0][0]
        res['code'] = m[0][1]
        return res
    return res

def chat(args):
    global AI
    (key, host) = (args["OPENAI_API_KEY"], args["OPENAI_API_HOST"])
    AI = AzureOpenAI(api_version="2023-12-01-preview", api_key=key, azure_endpoint=host)

    input = args.get("input", "")
    if input == "":
        res = {
            "output": "Welcome to the OpenAI demo chat",
            "title": "OpenAI Chat",
            "message": "You can chat with OpenAI."
        }
    else:
        output = ask(input)
        res = extract(output)
        res['output'] = output

    return {"body": res }
