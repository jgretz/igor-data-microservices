import {ITypeORMService} from '@jgretz/igor-data';

export type CommandServices = {
  [key: string]: (args: CommandEventArgs) => unknown | Promise<unknown>;
};

export interface CommandEventArgs {
  target: string;
  query?: {
    string: unknown;
  };
  body?: {
    string: unknown;
  };
}

export type CrudServices = {[key: string]: ITypeORMService};

export enum CrudTypes {
  Find = 'Find',
  FindOne = 'FindOne',
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
}

export interface CrudEventArgs {
  type: CrudTypes;
  source: string;
  resource: string;
  query?: {
    string: unknown;
  };
  id?: number;
  body?: {
    string: unknown;
  };
}
