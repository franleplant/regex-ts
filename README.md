# TODO

## Dev notes

- Debug the top level API (super interesting)

```sh
DEBUG="RegExp" DEBUG_DEPTH=10 yarn test:unit --verbose
```

- Debug the parser

```sh
DEBUG="parser" DEBUG_DEPTH=10  DEBUG_HIDE_DATE=true yarn test:unit -- --match="*parser*" --verbose
```
