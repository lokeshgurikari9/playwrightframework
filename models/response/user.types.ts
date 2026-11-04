export interface UserResponse {
  id: string;
  name: string;
  job: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserItem {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserItem[];
}

export interface SingleUserResponse {
  data: UserItem;
}

export interface SupportInfo {
  url: string;
  text: string;
}
