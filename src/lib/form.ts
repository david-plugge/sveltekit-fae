import { enhance } from '$app/forms';
import type { Action } from '@sveltejs/kit';
import { writable, type Readable, get } from 'svelte/store';
import type { ActionData, SubmitFunction } from './types';
import { page } from '$app/stores';

type FormState<T extends Action> = Readonly<{
	isLoading: boolean;
	isError: boolean;
	isFailure: boolean;
	isSuccess: boolean;
	status?: number;
	data?: ActionData<T>;
}>;

interface CreateFormResult<T extends Action> extends Readable<FormState<T>> {
	enhance: (form: HTMLFormElement) => {
		destroy(): void;
	};
	readonly queryParam: string;
	readonly action: string;
}

type FaeActions = {
	[K: string]: FaeActions | Action;
};

type FaeProxy<T extends FaeActions> = {
	[K in keyof T]: T[K] extends FaeActions
		? FaeProxy<T[K]>
		: T[K] extends Action
		? {
				createForm(): CreateFormResult<T[K]>;
				getPath(): string;
		  }
		: never;
};

export function createClient<T extends FaeActions>() {
	return createProxy<T>();
}

function createProxy<T extends FaeActions>(path: string[] = []): FaeProxy<T> {
	return new Proxy(
		{},
		{
			get(_target, p) {
				if (p === 'createForm') {
					return () => createForm(path.join('.'));
				}
				if (p === 'getPath') {
					return () => path.join('.');
				}

				return createProxy([...path, p.toString()]);
			}
		}
	) as any;
}

function createForm<T extends Action>(path: string): CreateFormResult<T> {
	let state: FormState<T> = {
		isLoading: false,
		isError: false,
		isFailure: false,
		isSuccess: false
	};

	const store = writable(state);
	const set = (data: Partial<FormState<T>>) => store.set((state = { ...state, ...data } as any));

	const serverData = get(page).data.fae;
	if (serverData?.actionName === path) {
		set(serverData.data);
	}

	return {
		subscribe: store.subscribe,
		get queryParam() {
			return `fae=${path}`;
		},
		get action() {
			return `?fae=${path}`;
		},
		enhance(form, submit?: SubmitFunction<T>) {
			return enhance(form, (input) => {
				set({
					isLoading: true,
					isError: false,
					isFailure: false,
					isSuccess: false
				});
				const out = submit?.(input);

				return async (input) => {
					set({
						isLoading: false,
						isError: input.result.type === 'error',
						isFailure: input.result.type === 'failure',
						isSuccess: input.result.type === 'success',
						status: input.result.status,
						data:
							input.result.type === 'success' || input.result.type === 'failure'
								? input.result.data
								: (undefined as any)
					});

					const handle = await out;
					if (handle) {
						await handle(input as any);
					} else {
						await input.update();
					}
				};
			});
		}
	};
}
