import { create } from "zustand";

import { User } from "../../models/User";
import { useAppState } from "../../store";
import { Backend } from "../../backend";

interface HomeState
{
	loading: boolean;
	following: User[];
	loadFollowing(): Promise<void>;
}

export const useHome = create<HomeState>((set) => ({
	loading: false,
	following: [],

	async loadFollowing() {
		const backend = new Backend(useAppState.getState().authToken);
		const result = await backend.request<{ following: User[] }>('GET', '/following');

		set({ loading: true });

		try
		{
			if (result?.following)
				set({ following: result.following })
		}
		catch(err)
		{
			throw err;
		}
		finally
		{
			set({ loading: false });
		}
	},
}));