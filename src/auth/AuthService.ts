import * as express from 'express';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UsersRepository } from '../api/repositories/UsersRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { decryptToken } from '../api/utils';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UsersRepository
    ) { }

    public async parseBasicAuthFromRequest(req: express.Request): Promise<number> {
        //@ts-ignore
        const authorization = req.header('authorization');
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            this.log.info('Credentials provided by the client');
            if (!authorization) {
                return undefined;
            }
            const token = authorization.split(' ')[1];
            if (!token) {
                return undefined;
            }
            if (token) {
                const UserId = await decryptToken(token);
                return UserId;
            }
            return undefined;
        }
        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async validateUser(userId: number, type: any): Promise<any> {
        const user = await this.userRepository.findOne({ where: { userId, isActive: 1, typeId: type } });
        if (user) {
            return user;
        }
        return undefined;
    }

    public async validateUserByEmail(email: string, type: any): Promise<any> {
        const user = await this.userRepository.findOne({ where: { email, typeId: type } });
        if (user) {
            return user;
        }
        return undefined;
    }

    public async checkTokenExist(req: express.Request): Promise<number> {
        //@ts-ignore
        const authorization = req.header('authorization');
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            if (!authorization) {
                return undefined;
            }
            const token = authorization.split(' ')[1];
            if (token) {
                const UserId = await decryptToken(token);
                return UserId;
            }
            return undefined;
        }
        return undefined;

    }
}
