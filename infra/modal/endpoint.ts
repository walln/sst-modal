import type { ModalDeployment } from "./deployment";

interface ModalEndpointArgs {
	class?: string;
	method: string;
}

export class ModalEndpoint extends $util.ComponentResource {
	url: string;

	constructor(
		name: string,
		args: ModalEndpointArgs,
		deployment: ModalDeployment,
		opts?: $util.ComponentResourceOptions,
	) {
		super(__pulumiType, name, args, opts);

		this.url = createEndpoint({
			class: args.class,
			method: args.method,
			organization: deployment.environment.organization,
			appName: deployment.appName,
		});

		function createEndpoint({
			class: className,
			method,
			organization,
			appName,
		}: {
			class?: string;
			method: string;
			organization: string;
			appName: string;
		}) {
			const parts = [
				`${organization}-${deployment.environment.environment}--${appName}`,
				className,
				method,
			].filter(Boolean);

			const url = parts.join("-").toLocaleLowerCase();
			return `https://${url}.modal.run`;
		}
	}
}

const __pulumiType = "custom:modal:Endpoint";
// @ts-expect-error
ModalEndpoint.__pulumiType = __pulumiType;
