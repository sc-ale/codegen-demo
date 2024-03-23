#--web true
#--param AUTH $AUTH
#--param NUVOLARIS_APIHOST $NUVOLARIS_APIHOST

def main(args):
    print("ARGS=")
    print(args)
    key = args.get("AUTH")
    
    res = {
        "auth": key
    }
    return { "body": res}     