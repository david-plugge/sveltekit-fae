import { fail, type Action } from '@sveltejs/kit';

export const signin = (async ({ request }) => {
	const formData = await request.formData();
	const username = formData.get('username')?.toString();
	const password = formData.get('password')?.toString();

	if (!username || !password) {
		return fail(400, {
			errors: {
				username: !username ? 'Please enter your username' : undefined,
				password: !password ? 'Please enter your password' : undefined
			},
			values: {
				username
			}
		});
	}

	return {
		success: true
	};
}) satisfies Action;
