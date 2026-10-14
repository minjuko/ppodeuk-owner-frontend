import { setupWorker } from "msw";
import { demoHandlers } from "./demoHandlers.js";

export const worker = setupWorker(...demoHandlers);
