import { ModalEnvironment } from "./modal/environment";
import { ModalDeployment } from "./modal/deployment";
import { ModalEndpoint } from "./modal/endpoint";
import { ModalSecret } from "./modal/secret";
import { secretA } from "./secrets";

const environment = new ModalEnvironment("StageModalEnvironment", {
	stage: $app.stage,
	appName: $app.name,
	organization: "walln",
});

export const functionA = new ModalDeployment(
	"FunctionA",
	{
		handler: {
			appRef: "hello.py",
			directory: "packages/modal-function-a",
			modalAppName: "modal-function-a",
		},
		dev: {
			autostart: true,
		},
	},
	environment,
);

export const webEndpoint = new ModalEndpoint(
	"WebEndpoint",
	{
		class: "HelloWorld",
		method: "web",
	},
	functionA,
);

export const secretValue = new ModalSecret(
	"TestSecret",
	{
		secretName: "test-secret",
		secrets: [
			{ key: "key1", value: secretA.value },
			{ key: "key2", value: "value2" },
		],
	},
	environment,
);
