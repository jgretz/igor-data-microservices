import {Controller} from '@nestjs/common';
import {COMMAND, IgorResultType} from '@jgretz/igor-shared';
import {RabbitMessage, RabbitMqService} from '@jgretz/igor-rabbit';
import {CommandServices, CommandEventArgs} from '../Types';

@Controller()
export class CommandController {
  constructor(rabbit: RabbitMqService, key: string, commandServices: CommandServices) {
    rabbit.subscribe(COMMAND, key, async (message: RabbitMessage) => {
      const args = message.payload as CommandEventArgs;
      const service = commandServices[args.target];
      if (!service) {
        return {type: IgorResultType.NotFound};
      }

      try {
        const result = await service(args);
        return {type: IgorResultType.Success, result};
      } catch (err) {
        return {type: IgorResultType.Error, result: err.message};
      }
    });
  }
}
