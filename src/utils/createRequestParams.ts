/* eslint-disable @typescript-eslint/no-unused-vars */

import type { EndpointConfig, RequestInput, EndpointOptions } from '../factories';

import qs from 'query-string';

// region helpers
export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};
export const isString = (value: unknown): value is string => {
    return typeof value === 'string';
};
const isBlob = (value: unknown): value is Blob => {
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

const isFormData = (value: unknown): value is FormData => {
    return value instanceof FormData;
};

// endregion

// region main

const getPath = (config: EndpointConfig, input: Omit<RequestInput, 'formData' | 'requestBody'> = {}): string => {
    const url = config.route.replace(/{(.*?)}/g, (substring: string, group: string) => {
        if (input.hasOwnProperty(group)) {
            return encodeURI(String(input[group]));
        }
        return substring;
    });

    return url;
};

const getUrl = (config: EndpointConfig, input: RequestInput | null): string => {
    const { formData, requestBody, ...params } = input || {};
    const searchParams = qs.stringify(params);
    return [getPath(config, params), searchParams].filter(Boolean).join('?');
};

const getFormData = (input: RequestInput | null): FormData | undefined => {
    const { formData } = input || {};
    if (!formData) {
        return undefined;
    }
    const nextFormData = new FormData();

    const process = (key: string, value: unknown): void => {
        if (isString(value) || isBlob(value)) {
            nextFormData.append(key, value);
        } else {
            nextFormData.append(key, JSON.stringify(value));
        }
    };

    Object.entries(formData)
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

    return nextFormData;
};

const getRequestBody = (input: RequestInput | null): BodyInit | undefined => {
    const { requestBody } = input || {};
    if (requestBody === undefined) {
        return undefined;
    }
    if (isBlob(requestBody) || isString(requestBody) || isFormData(requestBody)) {
        return requestBody;
    }
    return JSON.stringify(requestBody);
};

const getHeaders = (config: EndpointConfig, input: RequestInput | null, options?: EndpointOptions): Headers => {
    const { requestBody } = input || {};
    const headers = Object.entries({
        Accept: 'application/json',
        ...options?.headers,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {} as Record<string, string>);

    if (requestBody) {
        if (config.mediaType) {
            headers['Content-Type'] = config.mediaType;
        } else if (isBlob(requestBody)) {
            headers['Content-Type'] = requestBody.type || 'application/octet-stream';
        } else if (isString(requestBody)) {
            headers['Content-Type'] = 'text/plain';
        } else if (!isFormData(requestBody)) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return new Headers(headers);
};

// endregion

export const createRequestParams = <Input extends RequestInput>(
    config: EndpointConfig,
    input: Input | null,
    options?: EndpointOptions
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
