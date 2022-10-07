import { Request } from "express";
import { OptionsFlags } from "../types";

type Token = {
    at: string,
    rt: string
}

export interface AppRequest<TData> extends Request {
    cookies: Request['cookies'] extends any ? OptionsFlags<Token> : null,
    user: TData
};