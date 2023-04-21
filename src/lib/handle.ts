import { type Action, type Handle, error, json, fail, type ActionFailure } from '@sveltejs/kit';
import { stringify as devalueStringify } from 'devalue';

type FaeActions = {
	[K: string]: FaeActions | Action;
};

const dataMap = new Map<string, any>();

function isFailure(v: unknown): v is ActionFailure {
	return v instanceof fail(400).constructor;
}

export const faeHandle = (actions: FaeActions): Handle => {
	return async ({ event, resolve }) => {
		if (event.request.method === 'POST' && event.url.searchParams.has('fae')) {
			const notFound = () =>
				error(404, {
					message: 'POST method not allowed. No action exist with the specified name'
				});

			const actionName = event.url.searchParams.get('fae');

			if (!actionName) {
				throw notFound();
			}

			const segments = actionName.split('.', 10);

			let action: any = actions;
			for (const segment of segments) {
				if (!action[segment]) {
					throw notFound();
				}
				action = action[segment];
			}

			if (typeof action !== 'function') {
				throw notFound();
			}

			const data = await (action as Action)(event);
			const failure = isFailure(data);

			// enhanced request
			if (event.request.headers.get('x-sveltekit-action') === 'true') {
				return json({
					type: failure ? 'failure' : 'success',
					status: failure ? data.status : data ? 200 : 204,
					data: stringify_action_response(failure ? data.data : data, actionName)
				});
			}

			// native behaviour
			const id = crypto.randomUUID();

			const headers = new Headers(event.request.headers);
			headers.set('x-fae-id', id);
			dataMap.set(id, {
				actionName,
				data: {
					isFailure: failure,
					data: failure ? data.data : data
				}
			});

			const res = await event
				.fetch(event.url, {
					method: 'GET',
					headers: headers
				})
				.finally(() => {
					dataMap.delete(id);
				});

			return res;
		}

		if (event.request.headers.has('x-fae-id')) {
			const id = event.request.headers.get('x-fae-id');
			if (!id) return resolve(event);
			const data = dataMap.get(id);
			if (!data) return resolve(event);

			event.locals.fae = data;

			return resolve(event);
		}

		return resolve(event);
	};
};

function stringify_action_response(data: any, route_id: string) {
	return try_deserialize(data, devalueStringify, route_id);
}

function try_deserialize(data: any, fn: (data: any) => string, route_id: string) {
	try {
		return fn(data);
	} catch (e) {
		const error: any = e;

		if ('path' in error) {
			let message = `Data returned from action inside ${route_id} is not serializable: ${error.message}`;
			if (error.path !== '') message += ` (data.${error.path})`;
			throw new Error(message);
		}

		throw error;
	}
}
