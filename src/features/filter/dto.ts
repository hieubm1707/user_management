export interface FilterDto {
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  month?: number;
  year?: number;
  userId?: string;
  sortBy?: 'amount' | 'month' | 'year' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}