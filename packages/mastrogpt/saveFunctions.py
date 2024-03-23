#--web true
#--param AUTH $AUTH
#--param NUVOLARIS_APIHOST $NUVOLARIS_APIHOST

import requests
import json

def main(args):
    print("ARGS=")
    print(args)
    auth_key = args.get("AUTH")
    nameFunction = args.get("name")
    kind = args.get("kind")
    code = args.get("code")
    APIHOST = args.get("NUVOLARIS_APIHOST")

    url = f"https://${APIHOST}/api/v1/namespaces/_/actions/${nameFunction}?overwrite=true"
    body = {
        'namespace': "_",
        'name': nameFunction,
        'exec': {
            'kind':kind,
            'code': code
        }
    }
    """
    try:
        res = requests.post(url=url, data=body, auth=("Authorization", auth_key))
        out = res.json()
    except Exception as e:
        out = {"error": f"Error in the request: {str(e)}"}
    
    print("RES=",res)
    return {
        "body": out,
        "statusCode": res.status_code
    }
    """
    return {
        "body": "ciao"
    }