import { EndpointConfig, RequestInput, EndpointOptions, Nullable } from './commons';

export interface ClientResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Nullable<Input>,
        options?: EndpointOptions
    ) => Promise<Output>;
}
