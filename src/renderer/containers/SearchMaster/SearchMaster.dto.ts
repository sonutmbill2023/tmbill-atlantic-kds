import { Service } from 'bonjour-service';

export interface IServiceList {
  serversList: Service[];
  discoveredIps: string[];
}
