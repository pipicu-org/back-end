import { Client } from '../../../api/models/entity';
import { ISeed } from '../ISeed';

export class ClientSeed implements ISeed<Client> {
    static instance: ClientSeed;

    static getInstance(): ClientSeed {
        if (!ClientSeed.instance) {
            ClientSeed.instance = new ClientSeed();
        }
        return ClientSeed.instance;
    }

    entity: string = 'Client';
    data: Client[] = [
        {
            id: 1,
            name: 'John Doe',
            phoneNumber: '123456',
            facebookUsername: null,
            instagramUsername: null,
            address: 'New street 123',
            orders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            name: 'John Doe 2',
            phoneNumber: '123789',
            facebookUsername: null,
            instagramUsername: null,
            address: 'Old street 123',
            orders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    getEntity(): string { return this.entity; };

    getData(): Client[] { return this.data; };
}
