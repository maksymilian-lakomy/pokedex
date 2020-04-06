export default function querify(params: Record<string, any>): string {
    let query = "";
    for (const param in params)
        query += `${param}=${params[param]}&`;
    return (query.endsWith('&')) ? query.slice(0, -1) : query;
}