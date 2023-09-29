export type EndpointConfig = {
    route: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    mediaType?: string;
};

export type EndpointOptions = Omit<RequestInit, 'method' | 'body'>;

export type RequestInput =
    | Record<string | number, unknown> &
          (
              | { formData: Record<string, string | Blob>; requestBody?: never }
              | { requestBody: BodyInit; formData?: never }
              | {}
          );
