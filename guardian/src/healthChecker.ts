import { InstancesStore } from "./instances.js";

export const healthChecker = (instancesStore: InstancesStore) => {
  let running = false
  return setInterval(async () => {
    if (running) {
      console.log('Health check is taking longer than 30 seconds')
      return;
    }
    running = true

    console.log('checking health of instances...')

    const instances = instancesStore.getInstances()

    console.log('instances:', instances.length)

    await Promise.all(instances.map(async (instance) => {

      if (instance === undefined) {
        return; // already been removed
      }

      const time_key = `health check: ${instance.id}`
      console.time(time_key)

      try {
        const url = new URL(`http://host.docker.internal:${instance.port}`)
        url.pathname = "/health"

        const response = await fetch(url, {
          timeout: true,
        })
        const text = await response.text()

        if (text !== "OK") {
          console.log(time_key, `disconnected`)
          instancesStore.deregisterInstance(instance.id);
        }

        console.log(time_key, `connected`)
        instancesStore.updateInstance(instance.id, (i) => {
          if (i) {
            i.timestamp = Date.now()
          }
          return i
        })
      } catch (error) {
        console.log(time_key, `failed to reach`)
        instancesStore.deregisterInstance(instance.id);
      } finally {
        console.timeEnd(time_key)
      }
      
    }))

    running = false

  }, 30 * 1000)
}