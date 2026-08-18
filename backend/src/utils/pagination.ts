import type { Request } from "express";

export function parsePagination(query: Request["query"]) {
    const page = Math.max(parseInt(String(query.page), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(query.limit), 10) || 12, 1), 50);
    return { page, limit };
}

export function parseLimit(query: Request["query"], fallback: number, max: number) {
    return Math.min(Math.max(parseInt(String(query.limit), 10) || fallback, 1), max);
}
