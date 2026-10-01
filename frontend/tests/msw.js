import { setupServer } from "msw/node";

export const API = "http://api.test/api";
export const server = setupServer();
