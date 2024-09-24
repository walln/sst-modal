# Lambda linking

Because we can define our modal infrastructure, we can also interact with them from lambdas.

This lambda function authorizes using our modal secret and then removely calls the modal function. This is a simple
example, but you can imagine how you could do lots of cool things with this such as offloading expensive computations to background
serverless gpu workers.
