/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return*/
import { IConfigParams } from '../interfaces/config-params';
import { NonFunctionPropertyNames } from '@boilerplate/shared';

type PropertyOf<T> = NonFunctionPropertyNames<T>;

export class ConfigService<CT = any> {
  private readonly currentConfig: any = process.env;
  private readonly windowConfig: any = (window as any)._env_;

  public get<PT extends PropertyOf<CT>>(paramName: PT, defaultValue?: CT[PT]): CT[PT] | undefined {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.getFromWindowConfig(paramName) || this.getFromBuildTimeConfig(paramName) || defaultValue;
  }

  private getFromWindowConfig<PT extends PropertyOf<CT>>(paramName: PT): CT[PT] | undefined {
    return this.windowConfig ? this.windowConfig[paramName] : undefined;
  }

  private getFromBuildTimeConfig<PT extends PropertyOf<CT>>(paramName: PT): CT[PT] | undefined {
    return this.currentConfig ? this.currentConfig[paramName] : undefined;
  }
}

export const configService = new ConfigService<IConfigParams>();
export default configService;
