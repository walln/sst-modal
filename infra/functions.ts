export const fn = new sst.aws.Function("TestFn", {
	runtime: "python3.11",
	handler: "packages/functions/index.handler",
	url: true,
});
