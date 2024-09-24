from sst import Resource


def handler(event, context):
    print("Function invoked from Python")

    return {
        "statusCode": 200,
        "body": "from Python!",
    }
