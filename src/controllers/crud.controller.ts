import {Controller} from '@nestjs/common';
import {CRUD, IgorResultType} from '@jgretz/igor-shared';
import {ITypeORMService} from '@jgretz/igor-data';
import {RabbitMessage, RabbitMqService} from '@jgretz/igor-rabbit';
import {CrudEventArgs, CrudServices, CrudTypes} from '../Types';

const execute = async (service: ITypeORMService, crudMessage: CrudEventArgs) => {
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
};

@Controller()
export class CrudController {
  constructor(rabbit: RabbitMqService, key: string, crudServices: CrudServices) {
    rabbit.subscribe(CRUD, key, async (message: RabbitMessage) => {
      const crudMessage = message.payload as CrudEventArgs;
      const service = crudServices[crudMessage.resource];
      if (!service) {
        return {type: IgorResultType.NotFound};
      }

      try {
        console.log(
          `Executing ${crudMessage.type} | ${crudMessage.source} | ${crudMessage.resource} | ${crudMessage.id} | ${crudMessage.query} `,
        );
        const result = await execute(service, crudMessage);

        return {type: IgorResultType.Success, result};
      } catch (err) {
        return {type: IgorResultType.Error, result: err.message};
      }
    });
  }
}
