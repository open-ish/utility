#!/usr/bin/env node

import { consoleHelper } from '../consoleHelper';
import { main } from './main';

main().catch((error) => {
  consoleHelper(error, 'red');
  process.exit(1);
});
