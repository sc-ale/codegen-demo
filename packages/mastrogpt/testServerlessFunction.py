#--param AUTH $AUTH
#--param NUVOLARIS_APIHOST $NUVOLARIS_APIHOST
#--annotation provide-api-key 1
#--web true

import requests
import json

def main(args):
    auth_key = args.get("AUTH")
    nameFunction, params = args.get("nameFunction"), args.get("params")
   
    __ow_headers = args.get("__ow_headers")
    APIHOST = __ow_headers.get("host")
    
    url = f"https://nuvolaris.dev/api/v1/namespaces/{APIHOST.split('.')[0]}/actions/{nameFunction}?blocking=true"
    response = None

    headers = {
        "Content-Type": "application/json"
    }

    try:
        res = requests.post(url=url, data=json.dumps(params), headers=headers, auth=(auth_key.split(':')[0], auth_key.split(':')[1]))
        out = res.json()
        response = {
            "body": out.get("response").get("result").get("body"),
            "statusCode": res.status_code
        }   
    except Exception as e:
        out = {"error": f"Error in the request: {str(e)}"}
        response = {
            "body": out,
        }
    
    return response