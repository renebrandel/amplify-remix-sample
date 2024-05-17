import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, Plugin, ResolvedConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { mkdir, writeFile, cp, rm } from 'node:fs/promises'
import { join } from 'node:path'

installGlobals();

const serverCode = /* js */ `import { createRequestHandler } from "@remix-run/express";
import express from "express";
import * as build from "./index.js";

const app = express();
app.use(express.static("static"));
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  console.log("App listening on http://localhost:3000");
});
`

const deploymentManifest = {
  "version": 1,
  "framework": { "name": "remix", "version": "2.9.2" },
  "routes": [
    {
      "path": "/*.*",
      "target": {
        "kind": "Static"
      },
      "fallback": {
        "kind": "Compute",
        "src": "default"
      }
    },
    {
      "path": "/*",
      "target": {
        "kind": "Compute",
        "src": "default"
      }
    }
  ],
  "computeResources": [
    {
      "name": "default",
      "runtime": "nodejs20.x",
      "entrypoint": "server.js"
    }
  ]
}

const packageJson = {
  type: "module"
}

const DEPLOY_OUTPUT_PATH = '.amplify-hosting'
const HOSTING_COMPUTE_PATH = join(DEPLOY_OUTPUT_PATH, 'compute', 'default')
const HOSTING_STATIC_PATH = join(DEPLOY_OUTPUT_PATH, 'static')

function amplifyHostingPlugin(): Plugin {
  let resolvedConfig: ResolvedConfig
  let currentCommand: string
  let isSsr: boolean | undefined
  return {
    name: 'aws-amplify-remix-adapter',
    apply: 'build',
    config(_, { command, isSsrBuild }) {
      currentCommand = command
      isSsr = isSsrBuild
    },
    async configResolved(config) {
      resolvedConfig = config
    },
    async writeBundle() {
      if (currentCommand !== 'build') { return }
      if (isSsr) {
        await mkdir(join(resolvedConfig.root, HOSTING_COMPUTE_PATH), { recursive: true })
        await cp(join(resolvedConfig.build.outDir), join(resolvedConfig.root, HOSTING_COMPUTE_PATH), { recursive: true })
        await cp(join(resolvedConfig.root, 'node_modules'), join(resolvedConfig.root, HOSTING_COMPUTE_PATH, 'node_modules'), { recursive: true })
        await writeFile(join(resolvedConfig.root, HOSTING_COMPUTE_PATH, 'server.js'), serverCode)
        await writeFile(join(resolvedConfig.root, HOSTING_COMPUTE_PATH, 'package.json'), JSON.stringify(packageJson))
        await writeFile(join(resolvedConfig.root, DEPLOY_OUTPUT_PATH, 'deploy-manifest.json'), JSON.stringify(deploymentManifest))
      } else {
        await rm(join(resolvedConfig.root, DEPLOY_OUTPUT_PATH), {recursive: true})
        await mkdir(join(resolvedConfig.root, HOSTING_STATIC_PATH), { recursive: true })
        await cp(resolvedConfig.build.outDir, join(resolvedConfig.root, HOSTING_STATIC_PATH), { recursive: true })
      }
    },
  };
}

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
    amplifyHostingPlugin()
  ],
});
