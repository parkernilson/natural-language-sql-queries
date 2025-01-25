#!/bin/bash
sed 's/^[[:space:]]*//' create.sql | tr '[:upper:]' '[:lower:]' > normalized_create.sql