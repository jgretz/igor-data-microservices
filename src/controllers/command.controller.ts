import {Controller} from '@nestjs/common';
import {RabbitMessage, RabbitMqService} from '@jgretz/igor-rabbit';
import {COMMAND, CommandServices, CommandEventArgs} from '../Types';

@Controller()
export class CommandController {
  constructor(rabbit: RabbitMqService, key: string, commandServices: CommandServices) {
    rabbit.subscribe(COMMAND, key, async (message: RabbitMessage) => {
      const args = message.payload as CommandEventArgs;
      const service = commandServices[args.target];
      if (!service) {
        return new Error(`handler for ${COMMAND} | ${key} pair not found`);
      }

      try {
        return await service(args);
      } catch (err) {
        return err instanceof Error ? err : new Error(err.message);
      }
    });
  }
}
