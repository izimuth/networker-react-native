
import { create } from 'zustand';
import { User, UserField } from '../../models/User';
import { useAppState } from '../../store';
import { Backend } from '../../backend';

interface FieldsState
{
	loading: boolean;
	fields: UserField[];
	setLoading(flag: boolean): void;
	loadFields(): Promise<void>;
}

export const useFieldState = create<FieldsState>((set, get) => ({
	fields: [],
	loading: false,

	setLoading(flag) 
	{
		set({ loading: flag });
	},

	async loadFields()
	{
		const authToken = useAppState.getState().authToken;
		const backend = new Backend(authToken);

		if (!authToken)
		{
			set({ fields: [] });
			return;
		}

		set({ loading: true });

		try
		{
			const resp = await backend.request<{ profile: User }>('GET', '/profile/self');
			set({ fields: resp?.profile.fields ?? [] });
		}
		finally
		{
			set({ loading: false });
		}
	},
}));