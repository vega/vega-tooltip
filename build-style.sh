#!/usr/bin/env bash

style=$(cat vega-tooltip.css)

printf "// generated with build-style.sh\nexport default \`${style}\`" > src/style.ts
