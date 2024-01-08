
import { profileUrl } from '../secrets.json';

export interface UserField
{
	id: number;
	user_id: number;
	field_icon_type: string;
	field_name: string;
	field_content: string;
}

export interface User 
{
	id: number;
	display_name: string;
	email: string;
	shareable_code: string;
	is_visible: boolean;
	avatar_file: string;
	fields: UserField[];
	following: number[];
	num_followers?: number;
	num_following?: number;
}

export interface UserAuthToken
{
	id: number;
	user_id: number;
	token_value: string;
	expires_after: number;
}

export function getShareableUrl(user: User)
{
	return `${profileUrl}/${user.shareable_code}`;
}