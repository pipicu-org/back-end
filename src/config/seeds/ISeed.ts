export interface ISeed<T> {
    entity: string;
    data: T[];

    getEntity(): string;
    getData(): T[];
}