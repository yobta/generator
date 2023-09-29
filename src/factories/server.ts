import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface ServerResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Input,
        options?: EndpointOptions
    ) => Promise<Output>;
}
