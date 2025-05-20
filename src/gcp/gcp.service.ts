import { Injectable } from '@nestjs/common';
import { InstancesClient } from '@google-cloud/compute';

@Injectable()
export class GcpService {

  private instancesClient = new InstancesClient();

  async turnVmOn(
    projectId: string,
    zone: string,
    instanceName: string,
  ): Promise<string> {
    // Obtener detalles de la instancia
    const [instance] = await this.instancesClient.get({
      project: projectId,
      zone,
      instance: instanceName,
    });

    const status = instance.status;

    if (status === 'RUNNING') {
      return `La VM '${instanceName}' ya está encendida.`;
    }

    // Iniciar la instancia si no está en ejecución
    await this.instancesClient.start({
      project: projectId,
      zone,
      instance: instanceName,
    });

    // Esperar hasta que la VM esté en estado RUNNING
    let currentStatus = status;
    while (currentStatus !== 'RUNNING') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const [updatedInstance] = await this.instancesClient.get({
        project: projectId,
        zone,
        instance: instanceName,
      });
      currentStatus = updatedInstance.status;
    }

    return `La VM '${instanceName}' ha sido encendida correctamente.`;
  }
}
