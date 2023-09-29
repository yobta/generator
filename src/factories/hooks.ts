/* eslint-disable @typescript-eslint/no-explicit-any */
import { SWRConfiguration, SWRResponse } from 'swr';

import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export type SWRHookResult<Data, E = Error, SWRConfig extends SWRConfiguration = SWRConfiguration> = SWRResponse<
    Data,
    E,
    SWRConfig
>;

export interface SWRHookFactory {
    <Input extends RequestInput, Output, E = Error, SWRConfig extends SWRConfiguration = SWRConfiguration<Output, E>>(
        config: EndpointConfig
    ): (input: Input, swrOptions?: SWRConfig, fetchOptions?: EndpointOptions) => SWRHookResult<Output, E, SWRConfig>;
}
