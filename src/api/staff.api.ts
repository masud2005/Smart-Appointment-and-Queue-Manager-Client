import { baseApi } from '@/api/axios';
import type {
	ApiResponse,
	CreateStaffPayload,
	Staff,
	StaffWithLoad,
	UpdateStaffPayload,
} from '@/types/api';

export const staffApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createStaff: build.mutation<ApiResponse<Staff>, CreateStaffPayload>({
			query: (body) => ({
				url: '/staff',
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['STAFF', 'APPOINTMENT', 'QUEUE', 'DASHBOARD'],
		}),

		getStaff: build.query<ApiResponse<Staff[]>, void>({
			query: () => ({
				url: '/staff',
				method: 'GET',
			}),
			providesTags: (result) => {
				if (!result?.data) {
					return [{ type: 'STAFF', id: 'LIST' }];
				}

				return [
					...result.data.map((staff) => ({
						type: 'STAFF' as const,
						id: staff.id,
					})),
					{ type: 'STAFF' as const, id: 'LIST' },
				];
			},
		}),

		getStaffById: build.query<ApiResponse<Staff>, string>({
			query: (id) => ({
				url: `/staff/${id}`,
				method: 'GET',
			}),
			providesTags: (_result, _error, id) => [{ type: 'STAFF', id }],
		}),

		updateStaff: build.mutation<
			ApiResponse<Staff>,
			{ id: string; body: UpdateStaffPayload }
		>({
			query: ({ id, body }) => ({
				url: `/staff/${id}`,
				method: 'PATCH',
				data: body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'STAFF', id },
				{ type: 'STAFF', id: 'LIST' },
				'APPOINTMENT',
				'QUEUE',
				'DASHBOARD',
			],
		}),

		deleteStaff: build.mutation<ApiResponse<null>, string>({
			query: (id) => ({
				url: `/staff/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'STAFF', id },
				{ type: 'STAFF', id: 'LIST' },
				'APPOINTMENT',
				'QUEUE',
				'DASHBOARD',
			],
		}),

		getStaffWithLoad: build.query<ApiResponse<StaffWithLoad[]>, string | void>({
			query: (date) => ({
				url: '/staff/load/with-appointments',
				method: 'GET',
				params: date ? { date } : undefined,
			}),
			providesTags: [{ type: 'STAFF', id: 'LOAD' }],
		}),
	}),
});

export const {
	useCreateStaffMutation,
	useGetStaffQuery,
	useGetStaffByIdQuery,
	useUpdateStaffMutation,
	useDeleteStaffMutation,
	useGetStaffWithLoadQuery,
} = staffApi;
