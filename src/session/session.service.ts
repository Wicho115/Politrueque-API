import { Injectable } from '@nestjs/common';
import {remove} from 'lodash';
import { RedisCacheService } from 'src/cache/resid-cache.service';

@Injectable()
export class SessionService {
    constructor(
        private readonly cache : RedisCacheService,
    ){}

    public async createSession(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};        
        
        if (!data.tokens) data.tokens = [];
        data.tokens.push(token);

        await this.cache.setJSON('user:' + id, data);
    }

    public async isValidToken(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        const tokens = data.tokens || [];

        return tokens.includes(token);
    }

    public async invalidateToken(id: string, token: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        data.tokens = remove(data.tokens || [], (tok, _index , _arr) =>{
            return !(tok === token)
        });

        await this.cache.setJSON('user:' + id, data);
    }

    public async invalidateAllTokens(id: string) {
        const data = (await this.cache.getJSON('user:' + id)) || {};
        data.tokens = [];
        await this.cache.setJSON('user:' + id, data);
    }
}
