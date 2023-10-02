import { EndpointConfig, RequestInput, EndpointOptions, MaybeNull } from './commons';

export interface ServerResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: MaybeNull<Input>,
        options?: EndpointOptions
    ) => Promise<Output>;
}
