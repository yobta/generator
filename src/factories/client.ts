import { EndpointConfig, RequestInput, EndpointOptions, MaybeNull } from './commons';

export interface ClientResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: MaybeNull<Input>,
        options?: EndpointOptions
    ) => Promise<Output>;
}
