import { ClientRequestDTO } from '../DTO/request/clientRequestDTO';
import { ClientSearchResponseDTO } from '../DTO/response/clientSearchResponseDTO';
import { Client } from '../entity';

export class ClientMapper {
  public createClientFromRequestDTO(requestDTO: ClientRequestDTO): Client {
    try {
      const client = new Client();
      client.name = requestDTO.name;
      client.phoneNumber = requestDTO.phoneNumber;
      client.address = requestDTO.address;
      client.facebookUsername = requestDTO.facebookUsername ?? null;
      client.instagramUsername = requestDTO.instagramUsername ?? null;

      return client;
    } catch (error) {
      console.error('Error creating client from request DTO:', error);
      throw new Error('Failed to create client');
    }
  }

  public createSearchToClientSearchDTO(
    resultsAndCount: [Client[], number],
    search: string,
    page: number,
    limit: number,
  ): ClientSearchResponseDTO {
    const result = new ClientSearchResponseDTO(
      search,
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((client) => ({
        id: client.id.toString(),
        name: client.name,
        phone: client.phoneNumber,
        address: client.address,
        instagramUsername: client.instagramUsername ?? null,
        facebookUsername: client.facebookUsername ?? null,
        lastOrder:
          client.orders.length > 0
            ? client.orders[client.orders.length - 1].id.toString()
            : null,
      })),
    );
    return result;
  }
}
