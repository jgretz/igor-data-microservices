import {Controller} from '@nestjs/common';
import {RabbitMessage, RabbitMqService} from '@jgretz/igor-rabbit';
import {COMMAND, CommandServices, CommandEventArgs} from '../Types';

@Controller()
export class CommandController {
  constructor(rabbit: RabbitMqService, key: string, commandServices: CommandServices) {
    rabbit.subscribe(COMMAND, key, (message: RabbitMessage) => {
      const args = message.payload as CommandEventArgs;
      const service = commandServices[args.target];
      if (!service) {
        return null; // TODO: figure out what to return
      }

      service(args);
    });
  }
}
