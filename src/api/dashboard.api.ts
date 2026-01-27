import { baseApi } from '@/api/axios';
import type {
	ActivityLogEntry,
	ApiResponse,
	DashboardSummary,
	StaffLoadSummary,
} from '@/types/api';

export const dashboardApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getDashboardSummary: build.query<ApiResponse<DashboardSummary>, string | void>({
			query: (date) => ({
				url: '/dashboard/summary',
				method: 'GET',
				params: date ? { date } : undefined,
			}),
			providesTags: ['DASHBOARD'],
		}),

		getStaffLoadSummary: build.query<ApiResponse<StaffLoadSummary[]>, string | void>({
			query: (date) => ({
				url: '/dashboard/staff-load',
				method: 'GET',
				params: date ? { date } : undefined,
			}),
			providesTags: ['DASHBOARD', { type: 'STAFF', id: 'LOAD' }],
		}),

		getRecentActivityLogs: build.query<ApiResponse<ActivityLogEntry[]>, number | void>({
			query: (limit) => ({
				url: '/dashboard/activity-logs',
				method: 'GET',
				params: limit ? { limit } : undefined,
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
