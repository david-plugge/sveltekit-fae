import { createClient } from '$lib';
import type { faeActions } from '.';

export const fae = createClient<typeof faeActions>();
