import { LineResponseDTO } from '../DTO/response/lineResponeDTO';
import { LineSearchResponseDTO } from '../DTO/response/lineSearchResponseDTO';
import { Line } from '../entity';

export class LineMapper {
  public toResponseDTO(line: Line): LineResponseDTO {
    return new LineResponseDTO(line);
  }

  public toSearchResponseDTO(
    resultsAndCount: [Line[], number],
    page: number,
    limit: number,
  ): LineSearchResponseDTO {
    return new LineSearchResponseDTO(
      resultsAndCount[1],
      page,
      limit,
      resultsAndCount[0].map((line) => ({
        order: { id: line.order.id.toString() },
        client: {
          id: line.order.client.id.toString(),
          name: line.order.client.name,
        },
        line: {
          id: line.id.toString(),
          quantity: line.quantity,
          product: {
            id: line.product.id.toString(),
            name: line.product.name,
          },
        },
        state: line.preparation.state.name,
      })),
    );
  }
}
