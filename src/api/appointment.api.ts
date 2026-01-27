import { baseApi } from '@/api/axios';
import type {
	ApiResponse,
	Appointment,
	AppointmentFilters,
	AppointmentWithDetails,
	CreateAppointmentPayload,
	UpdateAppointmentPayload,
	StaffWithLoad,
} from '@/types/api';

export const appointmentApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createAppointment: build.mutation<
			ApiResponse<Appointment>,
			CreateAppointmentPayload
		>({
			query: (body) => ({
				url: '/appointments',
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['APPOINTMENT', 'QUEUE', 'STAFF', 'DASHBOARD'],
		}),

		getAppointments: build.query<
			ApiResponse<Appointment[]>,
			AppointmentFilters | void
		>({
			query: (filters) => ({
				url: '/appointments',
				method: 'GET',
				params: filters,
			}),
			providesTags: (result) => {
				if (!result?.data) {
					return [{ type: 'APPOINTMENT', id: 'LIST' }];
				}

				return [
					...result.data.map((appt) => ({
						type: 'APPOINTMENT' as const,
						id: appt.id,
					})),
					{ type: 'APPOINTMENT' as const, id: 'LIST' },
				];
			},
		}),

		getAppointmentsWithDetails: build.query<
			ApiResponse<AppointmentWithDetails[]>,
			AppointmentFilters | void
		>({
			query: (filters) => ({
				url: '/appointments/list/with-details',
				method: 'GET',
				params: filters,
			}),
			providesTags: [{ type: 'APPOINTMENT', id: 'LIST_DETAILS' }],
		}),

		getAppointmentById: build.query<ApiResponse<Appointment>, string>({
			query: (id) => ({
				url: `/appointments/${id}`,
				method: 'GET',
			}),
			providesTags: (_result, _error, id) => [{ type: 'APPOINTMENT', id }],
		}),

		getAppointmentWithDetails: build.query<
			ApiResponse<AppointmentWithDetails>,
			string
		>({
			query: (id) => ({
				url: `/appointments/${id}/details`,
				method: 'GET',
			}),
			providesTags: (_result, _error, id) => [{ type: 'APPOINTMENT', id }],
		}),

		updateAppointment: build.mutation<
			ApiResponse<Appointment>,
			{ id: string; body: UpdateAppointmentPayload }
		>({
			query: ({ id, body }) => ({
				url: `/appointments/${id}`,
				method: 'PATCH',
				data: body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'APPOINTMENT', id },
				{ type: 'APPOINTMENT', id: 'LIST' },
				{ type: 'APPOINTMENT', id: 'LIST_DETAILS' },
				'QUEUE',
				'STAFF',
				'DASHBOARD',
			],
		}),

		cancelAppointment: build.mutation<ApiResponse<Appointment>, string>({
			query: (id) => ({
				url: `/appointments/${id}/cancel`,
				method: 'PATCH',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'APPOINTMENT', id },
				{ type: 'APPOINTMENT', id: 'LIST' },
				{ type: 'APPOINTMENT', id: 'LIST_DETAILS' },
				'QUEUE',
				'STAFF',
				'DASHBOARD',
			],
		}),

		completeAppointment: build.mutation<ApiResponse<Appointment>, string>({
			query: (id) => ({
				url: `/appointments/${id}/complete`,
				method: 'PATCH',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'APPOINTMENT', id },
				{ type: 'APPOINTMENT', id: 'LIST' },
				{ type: 'APPOINTMENT', id: 'LIST_DETAILS' },
				'QUEUE',
				'STAFF',
				'DASHBOARD',
			],
		}),

		markNoShow: build.mutation<ApiResponse<Appointment>, string>({
			query: (id) => ({
				url: `/appointments/${id}/no-show`,
				method: 'PATCH',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'APPOINTMENT', id },
				{ type: 'APPOINTMENT', id: 'LIST' },
				{ type: 'APPOINTMENT', id: 'LIST_DETAILS' },
				'QUEUE',
				'STAFF',
				'DASHBOARD',
			],
		}),

		getAvailableStaffForService: build.query<
			ApiResponse<StaffWithLoad[]>,
			{ serviceId: string; date?: string }
		>({
			query: ({ serviceId, date }) => ({
				url: `/appointments/available-staff/${serviceId}`,
				method: 'GET',
				params: date ? { date } : undefined,
			}),
			providesTags: [{ type: 'STAFF', id: 'AVAILABLE_FOR_SERVICE' }],
		}),
	}),
});

export const {
	useCreateAppointmentMutation,
	useGetAppointmentsQuery,
	useGetAppointmentsWithDetailsQuery,
	useGetAppointmentByIdQuery,
	useGetAppointmentWithDetailsQuery,
	useUpdateAppointmentMutation,
	useCancelAppointmentMutation,
	useCompleteAppointmentMutation,
	useMarkNoShowMutation,
	useGetAvailableStaffForServiceQuery,
} = appointmentApi;
