#--param AUTH $AUTH
#--param NUVOLARIS_APIHOST $NUVOLARIS_APIHOST
#--annotation provide-api-key 1

import requests
import json

def main(args):
    auth_key = args.get("AUTH")
    nameFunction, kind, code = args.get("name"), args.get("kind"), args.get("code")
   
    # APIHOST = args.get("__OW_API_KEY") 
    __ow_headers = args.get("__ow_headers")
    APIHOST = __ow_headers.get("host")

    url = f"https://{APIHOST}/api/v1/namespaces/_/actions/{nameFunction}?overwrite=true"
    body = {
        'namespace': "_",
        'name': nameFunction,
        'exec': {
            'kind':kind,
            'code': code
        }
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    response = None
    try:
        res = requests.put(url=url, json=body, headers=headers, auth=(auth_key.split(':')[0], auth_key.split(':')[1]))
        out = res.json()
        response = {
            "body": out,
            "statusCode": res.status_code
        }   
    except Exception as e:
        out = {"error": f"Error in the request: {str(e)}"}
        response = {
            "body": out,
        }

    return response
