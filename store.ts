
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { User } from './models/User';
import { Backend } from './backend';

interface AppState
{
	currentUser?: User;
	authToken?: string;

	setCurrentUser(currentUser: User, authToken: string): void;
	clearCurrentUser(): void;
	updateUserInfo(info: Partial<User>): void;
	refreshUserInfo(): Promise<void>;
	signOut(fromAll: boolean): Promise<void>;
}

export const useAppState = create(
	persist<AppState>(
		(set, get) => ({
			setCurrentUser(currentUser, authToken) {
				set({ currentUser, authToken });
			},
	
			clearCurrentUser() {
				set({ currentUser: undefined, authToken: undefined });
			},

			updateUserInfo(info) {
				set({
					currentUser: { ...get().currentUser, ...info } as User,
				})
			},

			async refreshUserInfo() {
				const backend = new Backend(useAppState.getState().authToken);
				const result = await backend.request<any>('GET', '/profile/self');

				if (result?.profile)
				{
					console.log(result);
					get().updateUserInfo(result.profile);
				}
			},

			async signOut(fromAll) {
				const backend = new Backend(useAppState.getState().authToken);
				
				await backend.request('POST', '/auth/logout', {
					json: { fromAll }
				});
				
				set({ currentUser: undefined, authToken: undefined });
			}
		}),
		{
			name: 'networker-persisted',
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
);
