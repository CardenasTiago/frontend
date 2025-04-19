#!/bin/bash
set -e

sudo rm -rf node_modules

sudo rm pnpm-lock.yaml

sh ./scripts/init.sh