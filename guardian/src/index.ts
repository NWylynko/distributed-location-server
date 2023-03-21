import { createInstancesStore, type InstancesStore } from './instances.js';
import { Hono } from "hono";

import { registerHander } from "./handlers/register.js";
import { instancesHandler } from "./handlers/instances.js";
import { healthChecker } from './healthChecker.js';
import { configHandler } from './handlers/config.js';

declare global {
  var instancesStore: InstancesStore;
  var initialisedHealthChecker: boolean;
}

globalThis.instancesStore = globalThis.instancesStore ?? createInstancesStore();

const app = new Hono()
const instancesStore = globalThis.instancesStore

if (!globalThis.initialisedHealthChecker) {
  globalThis.initialisedHealthChecker = true;
  healthChecker(instancesStore);
}

app.get('/', (ctx) => ctx.text('Hello Guardian from Bun!'))
app.post('/register', registerHander(instancesStore))
app.get('/instances', instancesHandler(instancesStore))
app.get('/config', configHandler())

export default app