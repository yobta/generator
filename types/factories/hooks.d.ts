import { SchemaConfig, RequestInput, SchemaOptions, RequestOutput } from './commons';

export type HookResult<Data = RequestOutput> = [Data | undefined, { version?: number; isLoading: boolean }];

export interface HookFactory {
    <Input extends RequestInput, Output = RequestOutput>(config: SchemaConfig): (
        input: Input,
        options?: SchemaOptions
    ) => HookResult<Output>;
}
