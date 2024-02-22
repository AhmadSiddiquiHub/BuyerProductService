import { Service } from "typedi";

import { BlueDartService } from "./BlueDartService";

@Service()
export class ShipmentService {

    constructor(
        private blueDartService: BlueDartService,

    ) {

    }

    public async checkStandardDelivery(fromPincode: number, toPincode: number, productWeight?: string) {
        // const srCOD = (await this.shipRocketService.checkServicablity({
        //     delivery_postcode: toPincode,
        //     pickup_postcode: fromPincode,
        //     cod: 1,
        //     weight: productWeight
        // })) === false ? false : true;

        // const srPrePaid = (await this.shipRocketService.checkServicablity({
        //     delivery_postcode: toPincode,
        //     pickup_postcode: fromPincode,
        //     cod: 1,
        //     weight: productWeight
        // })) === false ? false : true;

        const bdPrepaid = await this.blueDartService.checkServicability(fromPincode, toPincode, 'Prepaid');

        return { /*srCOD, srPrePaid,*/ bdPrepaid };
    }

}