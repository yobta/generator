import { EndpointConfig, RequestInput, EndpointOptions } from './commons';

export interface ClientResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Input,
        options?: EndpointOptions
    ) => Promise<Output>;
}
