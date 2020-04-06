export default interface PageResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: Array<T>;
}