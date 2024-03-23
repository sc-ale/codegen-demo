#--web true
#--param OPENAI_API_HOST $OPENAI_API_HOST
#--param OPENAI_API_KEY $OPENAI_API_KEY
#--kind python:default

from chat import chat

def main(args):
    # TODO: remove these 2 lines
    print("ARGS IN OPEN=")
    print(args)
    return chat(args)
