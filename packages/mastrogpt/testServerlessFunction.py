import requests
import json

def main(args):
    print("\n\nARGS test ===\n\n",args)
 
    nameFunction, params = args.get("nameFunction"), args.get("params")
   
    __ow_headers = args.get("__ow_headers")
    APIHOST = __ow_headers.get("host")

    url = f"https://{APIHOST}/api/v1/web/{APIHOST.split('.')[0]}/default/{nameFunction}.http"
    print("\n\nTEXT ===\n\n",url)
    response = None
    try:
        #res = requests.get(url=url)
        #out = text(res)
        #print("\n\nTEXT ===\n\n",out)
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
