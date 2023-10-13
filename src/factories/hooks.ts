/* eslint-disable @typescript-eslint/no-explicit-any */

import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface QueryHookFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Input,
        hookOptions?: unknown,
        fetchOptions?: EndpointOptions
    ) => Output;
}

type MutationTrigger<MutationResult> = (...args: unknown[]) => Promise<MutationResult>;

export interface MutationHookFactory {
    <Input extends RequestInput, Output, HookOptions = {}, MutationResult extends Output = Output>(
        config: EndpointConfig
    ): (input: Input, hookOptions?: HookOptions, fetchOptions?: EndpointOptions) => [MutationTrigger<MutationResult>];
}
