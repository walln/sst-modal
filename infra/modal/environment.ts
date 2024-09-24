import { local } from "@pulumi/command";

interface ModalEnvironmentArgs {
	stage: string;
	appName: string;
	organization: string;
}

export class ModalEnvironment extends $util.ComponentResource {
	environment: string;
	appName: string;
	organization: string;

	constructor(
		name: string,
		args: ModalEnvironmentArgs,
		opts?: $util.ComponentResourceOptions,
	) {
		super(__pulumiType, name, args, opts);

		const modalEnvName = `${args.appName}-${args.stage}`;

		// Step 1: Check if the modal environment already exists
		const checkExists = new local.Command(
			`${name}-check-exists`,
			{
				create: `uv tool run modal environment list --json | grep -w ${modalEnvName} || true`,
			},
			{ parent: this },
		);

		// Step 2: Conditionally create the environment if it doesn't exist
		const createEnvCommand = `if [ -z "$(uv tool run modal environment list | grep -w ${modalEnvName})" ]; then uv tool run modal environment create ${modalEnvName}; fi`;

		new local.Command(
			`${name}-create`,
			{
				create: createEnvCommand,
				delete: `uv tool run modal environment delete --confirm ${modalEnvName}`,
			},
			{ parent: this, dependsOn: checkExists },
		);

		this.organization = args.organization;
		this.environment = modalEnvName;
		this.appName = args.appName;
	}
}

const __pulumiType = "custom:modal:Environment";
// @ts-expect-error
ModalEnvironment.__pulumiType = __pulumiType;
