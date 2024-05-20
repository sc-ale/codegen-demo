#--kind python:default
#--web true

def main(args):
    print("\n\nARGS ===\n\n"+args)
    name = args.get("name", "world")
    greeting = "Hello " + name + "!"
    return {"body": greeting}