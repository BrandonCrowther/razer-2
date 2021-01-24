#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfraStack } from '../lib/infra-stack';

// My account
const envCA = { account: '608635202590', region: 'ca-central-1' };

// Razer's
// const envUK = { account: '608635202590', region: 'ca-central-1' };

const app = new cdk.App();
new InfraStack(app, 'InfraStack', {env: envCA});
