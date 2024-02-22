import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CartRepository } from '../repositories/CartRepository';
import { Cart } from '../models/Cart';

@Service()
export class CartService {

    constructor(
        @OrmRepository() private repo: CartRepository) {
    }
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async update(id: number, cartItem: any): Promise<any> {
        cartItem.id = id;
        return this.repo.save(cartItem);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async delete(id: any): Promise<any> {
        return this.repo.delete(id);
    }
    public async addSingleProductToCart(productId: number, productVariantId: number, vendorId: number, userId: number, quantity: number): Promise<any> {
        let cartItem = await this.findOne({ where: { productId, productVariantId, vendorId, userId }});
        if (!cartItem) {
            const c = new Cart();
            c.productId = productId;
            c.productVariantId = productVariantId;
            c.vendorId = vendorId;
            c.quantity = quantity;
            c.userId = userId;
            cartItem = await this.create(c);
        } else {
            cartItem.quantity = cartItem.quantity + quantity;
            cartItem = await this.update(cartItem.id, cartItem);
        }
        return cartItem || {};
    }
}
