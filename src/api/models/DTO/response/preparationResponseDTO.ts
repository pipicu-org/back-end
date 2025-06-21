export interface IPreparationResponseDTO {
  order: {
    id: number;
    client: {
      id: number;
      name: string;
    };
    lines: Array<{
      id: number;
      quantity: number;
      product: {
        id: number;
        name: string;
      };
    }>;
    state: {
      id: number;
      name: string;
    };
  };
}
