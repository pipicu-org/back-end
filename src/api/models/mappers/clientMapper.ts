import { HttpError } from '../../../errors/httpError';
import { ClientRequestDTO } from '../DTO/request/clientRequestDTO';
import { ClientResponseDTO } from '../DTO/response/clientResponseDTO';
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
      throw new HttpError(500, 'Failed to create client from request DTO');
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
          client.orders[client.orders.length - 1]?.createdAt.toISOString() ??
          null,
      })),
    );
    return result;
  }

  public toResponseDTO(client: Client): ClientResponseDTO {
    try {
      return new ClientResponseDTO(client);
    } catch (error) {
      console.error('Error creating client response DTO:', error);
      throw new HttpError(500, 'Failed to create client response DTO');
    }
  }
}
