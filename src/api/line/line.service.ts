export interface ILineService {
  changeStateLine(
    lineId: number,
    stateId: number,
  ): Promise<
    import('../models/DTO/response/lineResponeDTO').LineResponseDTO | void
  >;
  findById(
    id: number,
  ): Promise<
    import('../models/DTO/response/lineResponeDTO').LineResponseDTO | void
  >;
  getLinesByOrderId(
    orderId: number,
  ): Promise<import('../models/DTO/response/lineResponeDTO').LineResponseDTO[]>;
  getLinesByState(
    stateId: number,
    page: number,
    limit: number,
  ): Promise<
    import('../models/DTO/response/lineSearchResponseDTO').LineSearchResponseDTO
  >;
  delete(lineId: number): Promise<void>;
}
