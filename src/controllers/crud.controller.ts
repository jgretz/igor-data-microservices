import {Controller} from '@nestjs/common';
import {RabbitMessage, RabbitMqService} from '@jgretz/igor-rabbit';
import {CRUD, CrudEventArgs, CrudServices, CrudTypes} from '../Types';

@Controller()
export class CrudController {
  constructor(rabbit: RabbitMqService, key: string, crudServices: CrudServices) {
    rabbit.subscribe(CRUD, key, async (message: RabbitMessage) => {
      const crudMessage = message.payload as CrudEventArgs;
      const service = crudServices[crudMessage.resource];
      if (!service) {
        return null; // TODO: figure out what to return
      }

      switch (crudMessage.type) {
        case CrudTypes.Find:
          return await service.find(crudMessage.query);

        case CrudTypes.FindOne:
          return await service.findOne(crudMessage.id);

        case CrudTypes.Create:
          return await service.create(crudMessage.body);

        case CrudTypes.Update:
          return await service.update(crudMessage.id, crudMessage.body);

        case CrudTypes.Delete:
          return await service.remove(crudMessage.id);
      }
    });
  }
}
