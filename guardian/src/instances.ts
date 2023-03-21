import { create3dMatrix } from "./3dmatrix.js";
import { env } from "./env.js";

type InstanceId = string;
type Instance = {
  id: string;
  hostname: string;
  port: string;
  timestamp: number;
}
type FullInstance = Instance & {
  height: number;
  width: number;
}

export const createInstancesStore = () => {
  const size = Math.sqrt(env.INSTANCES_PER_LAYER);
  const matrix = create3dMatrix<InstanceId, FullInstance>(size, size)

  function registerInstance(instance: Instance) {
    return matrix.addItem({
      ...instance,
      height: env.OVERLAP + (env.MAP_HEIGHT / size) + env.OVERLAP,
      width: env.OVERLAP + (env.MAP_WIDTH / size) + env.OVERLAP,
    });
  }

  function deregisterInstance(instanceId: InstanceId) {
    matrix.removeItem(instanceId);
  }

  return {
    getInstances: matrix.getItems,
    registerInstance,
    deregisterInstance,
    updateInstance: matrix.updateItem,
  }
}

export type InstancesStore = ReturnType<typeof createInstancesStore>