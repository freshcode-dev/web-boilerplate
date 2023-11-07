import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { isIP } from "class-validator";
import { firstValueFrom } from "rxjs";
import { IpAddressDetails, prepareIpAddress } from "@boilerplate/shared";
import { ConfigService } from "@nestjs/config";
import { IApiConfigParams } from "../interfaces/api-config-params";
import { AxiosResponse } from "@nestjs/terminus/dist/health-indicator/http/axios.interfaces";

@Injectable()
export class ExternalApisService {
	constructor(private readonly httpService: HttpService, private readonly configService: ConfigService<IApiConfigParams>) {}

	public async getIpAddressDetails(ipAddress: string): Promise<IpAddressDetails | undefined> {
		if (isIP(ipAddress, 4) && ipAddress.includes(':')) {
			ipAddress = prepareIpAddress(ipAddress);
		}

		if (this.configService.get('NX_PARSE_IP_WITH_THIRD_PARTY_SERVICE') !== 'true' || !isIP(ipAddress) || ipAddress === '::1') {
			return undefined;
		}

		const response = await firstValueFrom(this.httpService.get<IpAddressDetails>(`https://ipapi.co/${ipAddress}/json/`)) as AxiosResponse<IpAddressDetails>;

		return response.data;
	}
}
