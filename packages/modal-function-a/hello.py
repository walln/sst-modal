import modal

# THIS NEEDS TO MATCH THE APP NAME IN THE INFRASTRUCTURE
app = modal.App("modal-function-a")


@app.cls(secrets=[modal.Secret.from_name("test-secret")])
class HelloWorld:
    @modal.web_endpoint(docs=True)
    def web(self):
        import os

        message = hello_world.remote()
        secret_test1 = os.getenv("key1")
        secret_test2 = os.getenv("key2")
        return {
            "message": message,
            "secret_test1": secret_test1,
            "secret_test2": secret_test2,
        }


@app.function()
def hello_world():
    return "Hello, World!"
