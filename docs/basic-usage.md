# Basic usage

```md
$ generate-yobta --help

  Usage: generate-yobta [options]

  Options:
    -V, --version                               output the version number
    -i, --input <value>                         OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>                        Output directory (required)
    -f, --factories <value>                     Path to file with factories functions (required)
    --useUnionTypes <value>                     Use union types instead of enums (default: true)
    --exportSchemas <value>                     Write schemas to disk (default: false)
    --indent <value>                            Indentation options [4, 2, tab] (default: "4")
    --postfixModels                             Model name postfix
    --allowImportingTsExtensions                Generate .ts extentions on imports enstead .js (default: false)
    --allowedQueryHooksMethods <value>          Http methods for which hooks will be generated (example: GET,HEAD), default GET
    --allowedMutationHooksMethods <value>       Http methods for which mutation hooks will be generated (example: POST,PUT), default 'POST', 'PUT', 'PATCH', 'DELETE'
    --allowedServerMethods <value>              Http methods for which server resolvers will be generated (example: GET,HEAD), default GET
    -h, --help                                  display help for command

  Examples
    $ generate-yobta --input ./spec.json --output ./generated --factories some/dir
```

## Example

**package.json**

```json
{
    "scripts": {
        "generate": "generate-yobta --input ./spec.json --output ./generated --factories some/dir"
    }
}
```

**NPX**

```sh
npx @yobta/generator --input ./spec.json --output ./generated --factories some/dir
```

**Node.js**

```javascript
const GenerateYobta = require('@yobta/generator');

GenerateYobta.generate({
    input: './spec.json',
    output: './generated',
    factories: './factories.ts',
});

// Or by providing the content of the spec directly 🚀
GenerateYobta.generate({
    input: require('./spec.json'),
    output: './generated',
    factories: './factories.ts',
});
```
