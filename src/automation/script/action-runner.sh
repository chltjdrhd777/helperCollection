#!/bin/bash

### 1. download-runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-osx-arm64-2.314.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.314.1/actions-runner-osx-arm64-2.314.1.tar.gz
echo "e34dab0b4707ad9a9db75f5edf47a804e293af853967a5e0e3b29c8c65f3a004  actions-runner-osx-arm64-2.314.1.tar.gz" | shasum -a 256 -c
tar xzf ./actions-runner-osx-arm64-2.314.1.tar.gz
wait $!

### 2. configure-runner (should fix)
./config.sh --url https://github.com/reable-dev/EMS-BEMS-front-admin-renewal --token AN6KLTWATIXCGR7HIB3E45LGAYKYQ
wait $!

### 3. activate-runner
nohup ./run.sh &