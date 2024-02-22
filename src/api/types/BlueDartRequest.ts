export const eTailCODAirOutbound = 'eTailCODAirOutbound';
export const eTailCODAirInbound = 'eTailCODAirInbound';
export const eTailPrePaidAirOutound = 'eTailPrePaidAirOutound';
export const eTailPrePaidAirInbound = 'eTailPrePaidAirInbound';

export interface Shipper {
    OriginArea: string,
    CustomerCode: string,
    CustomerName: string,
    CustomerAddress1: string,
    CustomerAddress2?: string,
    CustomerAddress3?: string,
    CustomerPincode: string,
    CustomerTelephone?: string,
    CustomerEmailID: string,
    Sender?: string,
    IsToPayCustomer: boolean
}

export interface Consignee {
    ConsigneeName: string,
    ConsigneeAddress1: string,
    ConsigneeAddress2?: string,
    ConsigneeAddress3?: string,
    ConsigneePincode: string,
    ConsigneeMobile?: string,
    ConsigneeEmailID?: string,
}

export interface Services {
    ProductCode: string | 'A',
    ProductType: number | 2,
    SubProductCode: 'P' | 'C',
    PieceCount: number | 1,
    ActualWeight: number,
    PackType?: string,
    DeclaredValue: number
    CreditReferenceNo: string,
    PickupDate: string,
    PickupTime: string,

    Dimensions?: [Dimensions] | [],
    itemdtl: [ItemDtl],
    RegisterPickup: boolean
}

export interface Dimensions {
    Length: number,
    Breadth: number,
    Height: number,
    Count: number
}

export interface ItemDtl {

    ItemID: string,
    ItemName: string,
    ItemValue: number,
    Itemquantity: number,
    TotalValue: number

}

export interface locationFinderPayload {
    pinCode: number,
    profile: profile
}

export interface profile {
    Area: string,
    Customercode: string,
    LicenceKey: string,
    LoginID: string
}


export interface wayBillPayload {
    Request: {
        Consignee: Consignee,
        Services: Services,
        Shipper: Shipper
    },
    Profile: {
        Area: string,
        Customercode: string,
        LicenceKey: string,
        LoginID: string,
        Api_type: 'T' | 'S',
    }
}