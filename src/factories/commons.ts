export type SchemaConfig = {
    path: string;
    method: 'GET' | 'PUT' | 'POST' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
    mediaType?: string;
};

export type SchemaOptions = Omit<RequestInit, 'method' | 'body'>;

export type RequestInput =
    | {
          formData?: Record<string, unknown>;
          requestBody?: string | Blob | File | Record<string, unknown>;
          [key: string]: unknown;
      }
    | undefined;

export type RequestOutput = unknown;