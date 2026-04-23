// Temporary file to verify CI checks catch violations. To be reverted.
import { z } from 'zod'
import pMap from 'p-map'

export const ciTestBadNumber: number    =    'definitely-a-string'

const ciTestUnused = 42

void z
void pMap
