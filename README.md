# Toy RegExp engine ![Node.js CI](https://github.com/franleplant/regex-ts/workflows/Node.js%20CI/badge.svg)

This is a Toy RexExp engine written in Typescript as a learning
and teaching exercise. It isn't meant to be feature complete and
it is written in the _best_ and most _simplest_ way I could manage.

Any improvements on that front are more than welcomed!

## Why a RegExp engine?

- it is something that programmers use on a day to day basis
- it combines a wide variety of computer science techniques and data structures
- it has common ground with Compilers so it is a nice exercise towards learning Compilers
- I find it very interesting

## Dev notes

- Debug the top level API (check the whole compilation pipeline)

```sh
DEBUG="RegExp*" DEBUG_DEPTH=10 yarn test:unit --verbose
```

- Debug the parser

```sh
DEBUG="parser" DEBUG_DEPTH=10  DEBUG_HIDE_DATE=true yarn test:unit -- --match="*parser*" --verbose
```
