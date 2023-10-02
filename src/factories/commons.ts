export type EndpointConfig = {
    route: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    mediaType?: string;
};

export type EndpointOptions = Omit<RequestInit, 'method' | 'body'>;

type EmptyParams = {};

export type RequestInput =
    | Record<string | number, unknown> &
          (
              | { formData: Record<string, string | Blob>; requestBody?: never }
              | { requestBody: BodyInit; formData?: never }
              | EmptyParams
          );

export type MaybeNull<I> = I extends EmptyParams ? (EmptyParams extends I ? null : I) : I;
