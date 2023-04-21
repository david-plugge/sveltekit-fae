import { fail, type Action } from '@sveltejs/kit';

export const subscribe = (async ({ request }) => {
	const formData = await request.formData();
	const email = formData.get('email')?.toString();

	if (!email) {
		return fail(400, {
			errors: {
				email: 'Please enter your email'
			}
		});
	}

	return {
		success: true
	};
}) satisfies Action;
