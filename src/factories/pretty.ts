export type Pretty<Type> = {
    [Key in keyof Type]: Type[Key];
} & {};
