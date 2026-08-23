import { serveStdio } from '@modelcontextprotocol/server/stdio'

import { createServer } from './create-server.ts'
import { readFitAppConfig } from './read-fitapp-config.ts'

const config = readFitAppConfig()
void serveStdio(() => createServer(config))
