import { local } from "@pulumi/command";
import type { ModalEnvironment } from "./environment";

interface ModalSecretArgs {
	secretName: string;
	secrets: {
		key: string;
		value: $util.Input<string>;
	}[];
}

export class ModalSecret extends $util.ComponentResource {
	modalEnvironment: ModalEnvironment;

	constructor(
		name: string,
		args: ModalSecretArgs,
		modalEnvironment: ModalEnvironment,
		opts?: $util.ComponentResourceOptions,
	) {
		super(__pulumiType, name, args, opts);

		this.modalEnvironment = modalEnvironment;

		// Convert secrets to a string of key=value pairs, resolving the Input<string> values
		$util
			.all(args.secrets.map((secret) => secret.value))
			.apply((resolvedValues) => {
				// Map each secret's key with its corresponding resolved value
				const keyValuePairs = args.secrets.map(
					(secret, index) => `${secret.key}=${resolvedValues[index]}`,
				);

				const secrets = keyValuePairs.join(" ");

				new local.Command(
					`${name}-secret`,
					{
						create: `uv tool run modal secret create ${args.secretName} ${secrets} --env ${modalEnvironment.environment}`,
						update: `uv tool run modal secret create ${args.secretName} ${secrets} --env ${modalEnvironment.environment} --force`,
					},
					{ parent: this, dependsOn: [modalEnvironment] },
				);
			});
	}

	get environment() {
		return this.modalEnvironment;
	}
}

const __pulumiType = "custom:modal:Environment";
// @ts-expect-error
ModalSecret.__pulumiType = __pulumiType;
