import { InstancesStore } from "./instances.js";

export const healthChecker = (instancesStore: InstancesStore) => {
  let running = false
  setInterval(async () => {
    if (running) {
      console.log('Health check is taking longer than 30 seconds')
      return;
    }
    running = true

    const instances = [...instancesStore.getInstances()]

    await Promise.all(instances.map(async (instance) => {

      if (instance === undefined) {
        return; // already been removed
      }

      try {
        const url = new URL(`http://host.docker.internal:${instance.port}`)
        url.pathname = "/health"

        const response = await fetch(url, {
          timeout: true,
        })
        const text = await response.text()

        if (text !== "OK") {
          console.log(`instance ${instance.id} has been disconnected`)
          instancesStore.deregisterInstance(instance.id);
        }

        console.log(`instance ${instance.id} is still connected`)
        instancesStore.updateInstance(instance.id, (i) => {
          if (i) {
            i.timestamp = Date.now()
          }
          return i
        })
      } catch (error) {
        console.log(`failed to reach instance ${instance.id}`)
        instancesStore.deregisterInstance(instance.id);
      }
      
    }))

    running = false

  }, 30 * 1000)
}