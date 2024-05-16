# Host Remix on AWS Amplify (via Amplify deployment specification)

Created a sample Remix app that you can host on AWS Amplify via the [Amplify deployment specification](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-deployment-specification.html)

This is a simple demo app, **NOT PRODUCTION-READY**. It shows how you can take the build outputs from `remix vite:build` and make them compatible with AWS Amplify's deployment specification.

The Amplify-specific files are:
- `amplify.yml` - the build specification so Amplify's build service runs a `postbuild` script after a `npm run build`
- `amplify-plugin/`
  - `deploy-manifest.json` - [Configuration details and metadata for deployment](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-deployment-specification.html#deployment-manifest-json). Designates which routes should be served statically vs. dynamically
  - `server.js` - A copy of the express server from [the official Remix documentation](https://remix.run/docs/en/main/start/quickstart#bring-your-own-server)
  - `package.json` - Designates to use `type: module` to allow for `import`s at runtime