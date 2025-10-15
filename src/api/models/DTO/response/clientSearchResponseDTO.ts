export class ClientSearchResponseDTO {
  search: string;
  total: number;
  page: number;
  limit: number;
  data: Array<{
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
    instagramUsername: string | null;
    facebookUsername: string | null;
    lastOrder: string | null;
  }>;

  constructor(
    search: string,
    total: number,
    page: number,
    limit: number,
    data: Array<{
      id: string;
      name: string;
      phoneNumber: string;
      address: string;
      instagramUsername?: string | null;
      facebookUsername?: string | null;
      lastOrder: string | null;
    }>,
  ) {
    this.search = search;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.data = data.map((client) => ({
      ...client,
      instagramUsername: client.instagramUsername ?? null,
      facebookUsername: client.facebookUsername ?? null,
      lastOrder: client.lastOrder ?? null,
    }));
  }
}
