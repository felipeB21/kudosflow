import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const publicApi = treaty<App>(baseUrl).api.public;
export const privateApi = treaty<App>(baseUrl).api.dashboard;
