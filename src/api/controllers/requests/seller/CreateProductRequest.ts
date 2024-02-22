import { IsNotEmpty, IsIn, IsArray, ValidateNested, ArrayMinSize, IsNumber, ValidateIf, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class ProductShipping {
    @IsNotEmpty({ message: 'days are required in shipping array' })
    public days: number;

    @IsNotEmpty({ message: 'charges are required in shipping array' })
    public charges: number;

    @IsNotEmpty({ message: 'type are required in shipping array' })
    @IsIn(['free', 'standard', 'express'])
    public type: string;
}

class Images {
    @IsNotEmpty({ message: 'is_default is required in images array' })
    public is_default: number;

    @IsNotEmpty({ message: 'image is required in images array' })
    public image: string;
}

class VariantValue {
    @IsNotEmpty({ message: 'name is required in variant_value array' })
    public name: string;

    @IsNotEmpty({ message: 'image is required in value array' })
    public value: string;
}

class VariantInfo {
    @IsNotEmpty({ message: 'sku is required' })
    public sku: string;

    @IsNotEmpty({ message: 'price is required' })
    public price: number;

    @IsNotEmpty({ message: 'quantity is required' })
    public quantity: number;

    @IsNotEmpty({ message: 'condition is required' })
    public condition: string;

    public sale_price: string;

    @IsNotEmpty({ message: 'start_sale_date is required' })
    @ValidateIf(n => n.sale_price !== undefined || n.sale_price !== null || n.sale_price !== '')
    public start_sale_date: string;

    @IsNotEmpty({ message: 'end_sale_date is required' })
    @IsDateString()
    @ValidateIf(n => n.sale_price !== undefined || n.sale_price !== null || n.sale_price !== '')
    public end_sale_date: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(4)
    @Type(() => Images)
    public images: Images[];

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => VariantValue)
    public variant_value: VariantValue[];
}

export class CreateProductRequest {
    @IsNotEmpty({ message: 'p_name is required' })
    public p_name: string;

    @IsNotEmpty({ message: 'brandId is required' })
    @IsNumber()
    public brandId: number;

    @IsArray()
    @IsNumber({},{ each: true })
    public categories: number[];

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => VariantInfo)
    public variants_info: VariantInfo[];

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => ProductShipping)
    public shipping: ProductShipping[];
}