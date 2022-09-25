import { Request, Response } from "express";

export type OptionsFlags<T> = {
    [P in keyof T]?: T[P]
}

export type BooleanFlags<T> = {
    [P in keyof T]: boolean;
}

type TypedResponse<T> = Omit<Response, 'json'> & { json(data: T): Response };
type JsonResponse = {
    status: number;
    message: string;
    data: any
}
export type AppResponse = TypedResponse<JsonResponse>;

export type AppRequest = Request & { rt: string };