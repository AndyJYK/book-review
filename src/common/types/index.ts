export type OptionsFlags<T> = {
    [P in keyof T]?: T[P]
}

export type BooleanFlags<T> = {
    [P in keyof T]: boolean;
}