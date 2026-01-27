import { baseApi } from '@/api/axios';
import type {
	ActivityLogEntry,
	ApiResponse,
	DashboardSummary,
	StaffLoadSummary,
} from '@/types/api';

export interface DashboardQueryParams {
	range?: 'ALL' | 'TODAY' | 'THIS_WEEKEND' | 'THIS_MONTH' | 'THIS_YEAR';
}

export interface ActivityLogsQueryParams {
	range?: 'ALL' | 'TODAY' | 'THIS_WEEKEND' | 'THIS_MONTH' | 'THIS_YEAR';
	limit?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getDashboardSummary: build.query<ApiResponse<DashboardSummary>, DashboardQueryParams | void>({
			query: (params) => ({
				url: '/dashboard/summary',
				method: 'GET',
				params: params ? { range: params.range } : undefined,
			}),
			providesTags: ['DASHBOARD'],
		}),

		getStaffLoadSummary: build.query<ApiResponse<StaffLoadSummary[]>, DashboardQueryParams | void>({
			query: (params) => ({
				url: '/dashboard/staff-load',
				method: 'GET',
				params: params ? { range: params.range } : undefined,
			}),
			providesTags: ['DASHBOARD', { type: 'STAFF', id: 'LOAD' }],
		}),

		getRecentActivityLogs: build.query<ApiResponse<ActivityLogEntry[]>, ActivityLogsQueryParams | void>({
			query: (params) => ({
				url: '/dashboard/activity-logs',
				method: 'GET',
				params: params ? { range: params.range, limit: params.limit } : undefined,
			}),
			providesTags: ['DASHBOARD'],
		}),
	}),
});

export const {
	useGetDashboardSummaryQuery,
	useGetStaffLoadSummaryQuery,
	useGetRecentActivityLogsQuery,
} = dashboardApi;
