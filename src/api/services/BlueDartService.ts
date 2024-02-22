import axios from "axios";
import { PluginService } from "./PluginService";
import { Service } from "typedi";

import { Logger } from '../../lib/logger/Logger';
import { eTailCODAirInbound, eTailCODAirOutbound, eTailPrePaidAirInbound, eTailPrePaidAirOutound, locationFinderPayload } from "../types/BlueDartRequest";


@Service()
export class BlueDartService {

    private static log: Logger;

    constructor(
        private pluginService: PluginService,

    ) {
        BlueDartService.log = new Logger(__filename);

    }

    public async locationFinder(pincode: number) {
        const bluedartConfig = await this.pluginService.findByPluginName('bluedart');
        const profileDetails = JSON.parse(bluedartConfig.pluginAdditionalInfo).Profile;

        const locationFinderPayload: locationFinderPayload = {
            pinCode: pincode,
            profile: {
                Area: profileDetails.Area,
                Customercode: profileDetails.Customercode,
                LicenceKey: profileDetails.LicenceKey,
                LoginID: profileDetails.LoginID,
            }
        }


        const config = {
            method: 'post',
            url: profileDetails.LF_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: locationFinderPayload
        };

        console.log(config)
        try {
            const service = (await axios(config)).data;

            if (service.GetServicesforPincodeResult.IsError === false) {
                BlueDartService.log.info('Location', service.GetServicesforPincodeResult)
                return service.GetServicesforPincodeResult;
            }
            if (service.GetServicesforPincodeResult.IsError === true) {
                console.log(service.GetServicesforPincodeResult)
                BlueDartService.log.error('LocationFinder_Error', service.GetServicesforPincodeResult)
                return false;
            }

        } catch (error) {
            BlueDartService.log.error('LocationFinder_Error', error)
        }

        return false;
    }

    public async checkServicability(fromPincode: number, toPincode: number, paymentMethod) {

        let fromAvailability = await this.locationFinder(fromPincode);
        let toAvailability = await this.locationFinder(toPincode);

        if (fromAvailability && toAvailability) {
            if (paymentMethod === 'COD') {
                if (fromAvailability[eTailCODAirOutbound] === 'Yes' && toAvailability[eTailCODAirInbound] === 'Yes') {
                    return true;
                }
            }
            if (paymentMethod === 'Prepaid') {
                if (fromAvailability[eTailPrePaidAirOutound] === 'Yes' && toAvailability[eTailPrePaidAirInbound] === 'Yes') {
                    return true;
                }
            }
        }

        return false;

    }
}