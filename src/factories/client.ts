import { MakeIntelliSense } from './MakeIntelliSense';
import { EndpointConfig, RequestInput, EndpointOptions, Nullable } from './commons';

export interface ClientResolverFactory {
    <Input extends RequestInput, Output>(config: EndpointConfig): (
        input: Nullable<MakeIntelliSense<Input>>,
        options?: EndpointOptions
    ) => Promise<MakeIntelliSense<Output>>;
}
