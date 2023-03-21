import { createInstancesStore, type InstancesStore } from './instances.js';
import { Hono } from "hono";

import { registerHander } from "./handlers/register.js";
import { instancesHandler } from "./handlers/instances.js";
import { healthChecker } from './healthChecker.js';

declare global {
  var instancesStore: InstancesStore;
}

globalThis.instancesStore = globalThis.instancesStore ?? createInstancesStore();

const app = new Hono()
const instancesStore = globalThis.instancesStore

healthChecker(instancesStore)

app.get('/', (ctx) => ctx.text('Hello Guardian from Bun!'))
app.post('/register', registerHander(instancesStore))
app.get('/instances', instancesHandler(instancesStore))

export default app