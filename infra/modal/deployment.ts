import { local } from "@pulumi/command";
import type { ModalEnvironment } from "./environment";
import path from "node:path";

interface ModalDeploymentArgs {
	dev: {
		autostart: boolean;
	};
	handler: {
		modalAppName: string;
		appRef: string;
		directory: string;
	};
}

export class ModalDeployment extends $util.ComponentResource {
	modalEnvironment: ModalEnvironment;
	modalAppName: string;

	constructor(
		name: string,
		args: ModalDeploymentArgs,
		modalEnvironment: ModalEnvironment,
		opts?: $util.ComponentResourceOptions,
	) {
		super(__pulumiType, name, args, opts);

		this.modalEnvironment = modalEnvironment;
		this.modalAppName = args.handler.modalAppName;

		if ($dev) {
			new sst.x.DevCommand(
				`${name}`,
				{
					dev: {
						command: `uv run dev.py ${args.handler.appRef} ${modalEnvironment.environment} ${args.handler.modalAppName}`,
						autostart: args.dev?.autostart ?? true,
						directory: args.handler.directory,
					},
				},
				{ dependsOn: [modalEnvironment], parent: this },
			);
		} else {
			new local.Command(
				`${name}DeployCommand`,
				{
					create: `uv tool run modal deploy -e ${modalEnvironment.environment} ${args.handler.appRef}`,
					update: `uv tool run modal deploy -e ${modalEnvironment.environment} ${args.handler.appRef}`,
					dir: path.join($cli.paths.root, args.handler.directory),
					triggers: [$asset(args.handler.directory)],
				},
				{ parent: this, dependsOn: [modalEnvironment] },
			);
		}
	}

	get environment() {
		return this.modalEnvironment;
	}

	get appName() {
		return this.modalAppName;
	}
}

sst.Linkable.wrap(ModalDeployment, (resource) => ({
	properties: {
		app: resource.appName,
		environment: resource.environment.environment,
	},
}));

const __pulumiType = "custom:modal:Deployment";
// @ts-expect-error
ModalDeployment.__pulumiType = __pulumiType;
