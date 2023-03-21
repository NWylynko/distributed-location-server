import { type Serve } from "bun";
import { z } from "zod";

const searchParamsSchema = z.object({
  containerId: z.string(),
});

function parseParams(req: Request) {
  const url = new URL(req.url);
  const params = searchParamsSchema.parse({
    containerId: url.searchParams.get("containerId")
  });
  return params
}

const containerSchema = z.array(
  z.object({
    "NetworkSettings": z.object({
      "Ports": z.object({
        "3000/tcp": z.array(
          z.object({
            "HostIp": z.string(),
            "HostPort": z.string()
          })
        )
      })
    })
  })
)

async function inspectContainer(container: string) {
  const child = Bun.spawn({ 
    cmd: ["docker", "inspect", container],
  })
  const text = await new Response(child.stdout).text();
  const containers = await containerSchema.parseAsync(JSON.parse(text));

  return containers[0]
}

type Container = Awaited<ReturnType<typeof inspectContainer>>;

function getContainerPort(container: Container) {
  return container.NetworkSettings.Ports["3000/tcp"][0].HostPort;
}

export default {
  async fetch(req: Request) {
    const {containerId} = parseParams(req);
    const container = await inspectContainer(containerId);
    const port = getContainerPort(container);
    return new Response(JSON.stringify({ port }));
  },
  port: 3000,
} satisfies Serve;