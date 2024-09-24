/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	app(input) {
		return {
			name: "sst-modal-test",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
			providers: { "@pulumi/command": "1.0.1" },
		};
	},
	async run() {
		const infra = await import("./infra");

		return {
			endpoint: infra.webEndpoint.url,
			lambda: infra.fn.url,
		};
	},
});
