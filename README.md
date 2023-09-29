# SDK Generator

> Node.js library that generates React/Nextjs/Swr/Typescript SDK based on the OpenAPI specification.

## Install

```
pnpm i @yobta/generator
```

## Usage

```
$ generate-yobta --help

  Usage: generate-yobta [options]

  Options:
    -V, --version             output the version number
    -i, --input <value>       OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>      Output directory (required)
    -f, --factories <value>   Path to file with factories functions (required)
    --useUnionTypes <value>   Use union types instead of enums (default: true)
    --exportSchemas <value>   Write schemas to disk (default: false)
    --indent <value>          Indentation options [4, 2, tab] (default: "4")
    --postfixModels           Model name postfix
    -h, --help                display help for command

  Examples
    $ generate-yobta --input ./spec.json --output ./generated --factories ./src/factories
```

## Documentation

-   [Basic usage](docs/basic-usage.md)
-   [Usage In Code](docs/in-code-usage.md)
-   [Enums vs. Union types](docs/enum-vs-union-types.md) `--useUnionTypes`
-   [Runtime schemas](docs/runtime-schemas.md) `--exportSchemas`
-   [Enum with custom names and descriptions](docs/custom-enums.md)
-   [Nullable props (OpenAPI v2)](docs/nullable-props.md)
-   [External references](docs/external-references.md)

## Support

-   [Babel support](docs/babel-support.md)

## Credits

This repository is a standalone fork of [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen). While it retains the same schema parsing mechanisms, it generates a distinct client that features [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), split server/client queries, and [SWR](https://swr.vercel.app/) support.
