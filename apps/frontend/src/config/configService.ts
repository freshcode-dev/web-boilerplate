import { ConfigParam } from '../enums/config-params.enum';

export class ConfigService {
  private readonly currentConfig: any = process.env;
  private readonly windowConfig: any = (window as any)._env_;

  public get<T = any>(paramName: ConfigParam, defaultValue?: T): T | undefined {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return this.getFromWindowConfig(paramName) || this.getFromBuildTimeConfig(paramName) || defaultValue;
  }

  private getFromWindowConfig<T = any>(paramName: ConfigParam): T | undefined {
    return this.windowConfig ? this.windowConfig[paramName] : undefined;
  }

  private getFromBuildTimeConfig<T = any>(paramName: ConfigParam): T | undefined {
    return this.currentConfig ? this.currentConfig[paramName] : undefined;
  }
}

export const configService = new ConfigService();
export default configService;
