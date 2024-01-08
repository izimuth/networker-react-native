
import { create } from 'zustand';
import { useAppState } from '../../store';
import { User } from '../../models/User';
import { Backend } from '../../backend';

interface ProfileStore
{
	loading: boolean;
	error?: string;
	user?: User;
	isFollowing: boolean;

	isSelf(): boolean;
	loadProfile(code: string): Promise<void>;
	refresh(): Promise<void>;
}

interface ProfileResult
{
	profile: User;
	followed: boolean;
}

export const useProfile = create<ProfileStore>((set, get) => ({
	loading: true,
	isFollowing: false,
	
	isSelf() 
	{
		const current = useAppState.getState().currentUser;
		return (current != undefined && current.id == get().user?.id);
	},

	async loadProfile(code: string)
	{
		const backend = new Backend(useAppState.getState().authToken);

		set({
			error: undefined,
			loading: true,
		});

		try
		{
			const result = await backend.request<ProfileResult>('GET', `/profile/${code}`);

			if (result)
			{
				set({ 
					user: result.profile,
					isFollowing: result.followed,
				});
			}
			else
			{
				set({ error: 'Invalid profile' });
			}
		}
		catch(err)
		{
			console.log(err);
			set({ error: 'Failed to load profile' });
		}
		finally
		{
			set({ loading: false });
		}
	},

	async refresh() 
	{
		const user = get().user;

		if (user)
			await this.loadProfile(user.shareable_code);
	}
}));
