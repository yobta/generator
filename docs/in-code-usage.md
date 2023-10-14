# In code usage

## Example

```bash
  $ generate-yobta --input ./spec.json --output ./generated --factories some/dir/factories.ts
```

some/dir/factories.ts

```typescript
import { ServerResolverFactory, ClientResolverFactory, HookFactory, createRequestParams } from '@yobta/generator';
import useSWR from 'swr'

export const createServerResolver: ServerResolverFactory = config => async (input, options) => {
    const [url, init] = createRequestParams(config, input, options);
    const response = await fetch(url, init);
    return response.json();
};

export const createClientResolver: ClientResolverFactory = config => async (input, options) => {
    const [url, init] = createRequestParams(config, input, options);
    const response = await fetch(${url}, init);
    return response.json();
};

export const createQueryHook: QueryHookFactory = config => (requestInput, swrOptions, fetchOptions) => {
    const [url, init] = createRequestParams(config, requestInput, fetchOptions);
    return { url, init, swrOptions } as any;
};

```

Some project file:

```typescript
import { Listing } from './generated/client';

const listing = await Listing.fetchOne({ slug: 'listing-slug' });
```
