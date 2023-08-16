/* eslint-disable @typescript-eslint/no-unused-vars */

import type { SchemaConfig, RequestInput, SchemaOptions } from '../../types';

// region helpers
export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};
export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};
export const isBlob = (value: unknown): value is Blob => {
    return (
        !!value &&
        typeof value === 'object' &&
        typeof (value as Blob).type === 'string' &&
        typeof (value as Blob).stream === 'function' &&
        typeof (value as Blob).arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test((value as Record<string, string>)[Symbol.toStringTag as unknown as string])
    );
};
export const isFormData = (value: unknown): value is FormData => {
    return value instanceof FormData;
};

// endregion

// region main
export const getQueryString = (params: Record<string, unknown>, handledParams: Record<string, boolean>): string => {
    const qs: string[] = [];

    const append = (key: string, value: unknown): void => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    const process = (key: string, value: unknown): void => {
        if (isDefined(value) && !handledParams[key]) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            } else if (typeof value === 'object' && value) {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
};
export const getUrl = (config: SchemaConfig, input: RequestInput): string => {
    const handledUrlParams: Record<string, boolean> = {
        formData: true,
        requestBody: true,
    };
    const url = config.path.replace(/{(.*?)}/g, (substring: string, group: string) => {
        // eslint-disable-next-line no-prototype-builtins
        if (input?.hasOwnProperty(group)) {
            handledUrlParams[group] = true;
            return encodeURI(String(input[group]));
        }
        return substring;
    });

    return `${url}${getQueryString(input || {}, handledUrlParams)}`;
};
export const getFormData = (input: RequestInput): FormData | undefined => {
    if (input?.formData) {
        const formData = new FormData();

        const process = (key: string, value: unknown): void => {
            if (isString(value) || isBlob(value)) {
                formData.append(key, value);
            } else {
                formData.append(key, JSON.stringify(value));
            }
        };

        Object.entries(input.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => {
                        process(key, v);
                    });
                } else {
                    process(key, value);
                }
            });

        return formData;
    }
    return undefined;
};
export const getRequestBody = (input: RequestInput): RequestInit['body'] => {
    if (input?.requestBody === undefined) return undefined;
    if (isBlob(input.requestBody) || isString(input.requestBody) || isFormData(input.requestBody)) {
        return input.requestBody;
    }
    return JSON.stringify(input.requestBody);
};
export const getHeaders = (config: SchemaConfig, input: RequestInput, options?: SchemaOptions): Headers => {
    const headers = Object.entries({
        Accept: 'application/json',
        ...options?.headers,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {} as Record<string, string>);

    if (input?.requestBody) {
        if (config.mediaType) {
            headers['Content-Type'] = config.mediaType;
        } else if (isBlob(input.requestBody)) {
            headers['Content-Type'] = input.requestBody.type || 'application/octet-stream';
        } else if (isString(input.requestBody)) {
            headers['Content-Type'] = 'text/plain';
        } else if (!isFormData(input.requestBody)) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return new Headers(headers);
};

// endregion

export const createRequestParams = <Input extends RequestInput>(
    config: SchemaConfig,
    input: Input,
    options?: SchemaOptions
): [RequestInfo, RequestInit] => {
    const url = getUrl(config, input);
    const init: RequestInit = {
        ...options,
        method: config.method,
        body: getRequestBody(input) ?? getFormData(input),
        headers: getHeaders(config, input, options),
    };

    return [url, init];
};
