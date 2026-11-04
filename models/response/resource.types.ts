export interface ResourceItem {
  id: number;
  name: string;
  year: number;
  color: string;
  pantone_value: string;
}

export interface ResourceListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ResourceItem[];
}

export interface SingleResourceResponse {
  data: ResourceItem;
}
