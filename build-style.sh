#!/usr/bin/env bash

printf "// generated with build-style.sh\nexport default \`" > src/style.ts
yarn -s sass vega-tooltip.scss >> src/style.ts
echo "\`;" >> src/style.ts
