import { faeHandle } from '$lib';
import { faeActions } from './actions';

export const handle = faeHandle(faeActions);
