import { baseApi } from '@/api/axios';
import type { ApiResponse, QueueAssignPayload, WaitingAppointment } from '@/types/api';

export const queueApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getWaitingQueue: build.query<ApiResponse<WaitingAppointment[]>, void>({
			query: () => ({
				url: '/queue/waiting',
				method: 'GET',
			}),
			providesTags: [{ type: 'QUEUE', id: 'WAITING' }],
		}),

		assignFromQueue: build.mutation<
			ApiResponse<WaitingAppointment>,
			QueueAssignPayload
		>({
			query: (body) => ({
				url: '/queue/assign',
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['QUEUE', 'APPOINTMENT', 'STAFF', 'DASHBOARD'],
		}),
	}),
});

export const { useGetWaitingQueueQuery, useAssignFromQueueMutation } = queueApi;
