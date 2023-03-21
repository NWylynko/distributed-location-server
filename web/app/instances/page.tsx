import { cache } from "react"
import { z } from "zod"

const instancesSchema = z.object({
  instances: z.array(
    z.object({
      id: z.string(),
      hostname: z.string(),
      port: z.string(),
      timestamp: z.number(),
      height: z.number(),
      width: z.number(),
      layer: z.number(),
      row: z.number(),
      column: z.number(),
    }).nullable().transform((instance) => (instance ? { 
      ...instance, 
      endpoint: `localhost:${instance.port}`,
      date: new Date(instance.timestamp),
    } : undefined))
  )
})

const fetchInstances = cache(async () => {
  const response = await fetch(`${process.env.GUARDIAN_API}/instances`, { cache: "no-cache" })
  const { instances } = await instancesSchema.parseAsync(await response.json())
  return instances
})

const configSchema = z.object({
	"INSTANCES_PER_LAYER": z.number(),
	"MAP_HEIGHT": z.number(),
	"MAP_WIDTH": z.number(),
	"OVERLAP": z.number()
})

const fetchConfig = cache(async () => {
  const response = await fetch(`${process.env.GUARDIAN_API}/config`)
  const config = await configSchema.parseAsync(await response.json())
  return config
})

const splitUpArray = <Item,>(array: Item[], size: number) => {
  return array.reduce((result, item, index) => {
    const chunkIndex = Math.floor(index / size)
    if (!result[chunkIndex]) {
      result[chunkIndex] = []
    }
    result[chunkIndex].push(item)
    return result
  }, [] as Item[][])
}

export default async function InstancesPage() {
  const instances = await fetchInstances()
  const config = await fetchConfig()

  const layers = splitUpArray(instances, config.INSTANCES_PER_LAYER)

  return (
    <main>
      <h1>Instances</h1>
      <pre>{JSON.stringify({ 
        stats: { 
          count: instances.length 
        },
        config
      }, null, 2)}</pre>
      <div className="relative">
        {layers.map((layer, layerIndex) => (
          <div className="m-2 absolute" style={{ top: layerIndex * 15, left: layerIndex * 15 }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, calc(9rem + 4rem))" }}>
              {layer.map((instance) => {
                if (!instance) {
                  return <div />
                }
                return (
                  <div key={instance.id} className={`relative border-2 border-black m-8 p-1 h-36 w-36 flex flex-col bg-white z-${(layerIndex + 1) * 10}`}>
                    <h2>{instance.hostname}</h2>
                    <span>[ {instance.layer} ] [ {instance.row} ] [ {instance.column} ]</span>
                    <span>{instance.endpoint}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(instances, null, 2)}</pre> */}
    </main>
  )
}