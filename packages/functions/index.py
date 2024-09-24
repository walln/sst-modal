import modal.config
from sst import Resource
import modal
import os


def handler(event, context):
    print("Function invoked from Python")

    # configure modal token
    os.environ["MODAL_TOKEN_ID"] = Resource.ModalTokenId.value
    os.environ["MODAL_TOKEN_SECRET"] = Resource.ModalTokenSecret.value

    print(
        f"Looking up modal function app:{Resource.FunctionA.app} fn:hello_world env:{Resource.FunctionA.environment}"
    )

    f = modal.Function.lookup(
        Resource.FunctionA.app,
        "hello_world",
        environment_name=Resource.FunctionA.environment,
    )
    result = f.remote()

    return {
        "statusCode": 200,
        "body": f" {result} from Python!",
    }
