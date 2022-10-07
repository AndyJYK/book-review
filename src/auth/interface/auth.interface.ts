export interface JwtSign {
    access_token: string;
    refresh_token: string;
}

export interface Payload {
    id: string;
    iss?: string;
    aud?: string;
}

export interface JwtPayload extends Omit<Payload, 'id'> {
    sub: string;
    iat?: number;
    exp?: number;
}