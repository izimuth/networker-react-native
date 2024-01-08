
import { apiUrl } from './secrets.json';
import { useAppState } from './store';

type RequestMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface BackendRequestOptions
{
	query?: Array<[string, string]>;
	json?: Record<string, any>;
	body?: string | FormData;
	headers?: Record<string, string>;
}

export class Backend
{
	authToken?: string;

	constructor(authToken?: string)
	{
		this.authToken = authToken;
	}

	async request<T>(method: RequestMethods, path: string, options?: BackendRequestOptions): Promise<T | undefined>
	{
		let url = `${apiUrl}/${path.replace(/^\//, '')}`;

		const init: RequestInit = { method };

		// add headers if specified
		init.headers = {
			...options?.headers,
		};

		// add query to url
		if (options?.query)
		{
			const usp = new URLSearchParams(options.query);
			url = `${url}?${usp.toString()}`;
		}

		// if json data is specified add to init
		if (options?.json)
		{
			init.headers['content-type'] = 'application/json';
			init.body = JSON.stringify(options.json);
		}
		// otherwise add post body if specified
		else if (options?.body)
		{
			init.body = options.body;
		}

		// add auth token if present
		if (this.authToken)
		{
			init.headers['authorization'] = `Bearer ${this.authToken}`;
		}

		const resp = await fetch(url, init); 

		if (resp.headers.get('content-type')?.startsWith('application/json')) 
		{
			const json = await resp.json();

			return json as T;
		}
		else
		{
			return undefined;
		}
	}
}

export function useBackend()
{
	const authToken = useAppState(state => state.authToken);

	return new Backend(authToken);
}