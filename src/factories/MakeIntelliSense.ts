export type MakeIntelliSense<Type> = {
    [Key in keyof Type]: Type[Key];
} & {};
