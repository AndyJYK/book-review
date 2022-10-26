export interface JwtSign {
    access_token: string;
    refresh_token: string;
}

export interface JwtPayload {
    sub: string;
    id: string;
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
}

export interface SignJwtPayload extends Omit<JwtPayload, 'sub'> { };