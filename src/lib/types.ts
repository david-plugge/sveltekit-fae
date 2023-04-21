import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type OptionalUnion<
	U extends Record<string, any>,
	A extends keyof U = U extends U ? keyof U : never
> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;

type ExcludeActionFailure<T> = T extends Kit.ActionFailure<any>
	? never
	: T extends void
	? never
	: T;

type UnpackValidationError<T> = T extends Kit.ActionFailure<infer X>
	? X
	: T extends void
	? Record<string, never>
	: T;

export type ActionSuccess<T extends (...args: any) => any> = Expand<
	OptionalUnion<ExcludeActionFailure<Awaited<ReturnType<T>>>>
>;

type ExtractActionFailure<T> = T extends Kit.ActionFailure<infer X>
	? X extends void
		? never
		: X
	: never;

export type ActionFailure<T extends (...args: any) => any> = Expand<
	OptionalUnion<Exclude<ExtractActionFailure<Awaited<ReturnType<T>>>, void>>
>;

export type SubmitFunction<T extends Kit.Action> = Kit.SubmitFunction<
	ActionSuccess<T>,
	ActionFailure<T>
>;

export type ActionData<T extends Kit.Action> = Expand<
	OptionalUnion<UnpackValidationError<Awaited<ReturnType<T>>>>
>;
