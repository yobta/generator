import { Pretty } from './pretty';
import { EndpointConfig, RequestInput, EndpointOptions, Nullable } from './commons';

export interface ClientResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Nullable<Pretty<Input>>,
        options?: EndpointOptions
    ) => Promise<Pretty<Output>>;
}
