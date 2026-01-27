import { baseApi } from '@/api/axios';
import type {
	ApiResponse,
	CreateServicePayload,
	Service,
	UpdateServicePayload,
} from '@/types/api';

export const serviceApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createService: build.mutation<ApiResponse<Service>, CreateServicePayload>({
			query: (body) => ({
				url: '/services',
				method: 'POST',
				data: body,
			}),
			invalidatesTags: ['SERVICE', 'APPOINTMENT', 'QUEUE', 'DASHBOARD'],
		}),

		getServices: build.query<ApiResponse<Service[]>, void>({
			query: () => ({
				url: '/services',
				method: 'GET',
			}),
			providesTags: (result) => {
				if (!result?.data) {
					return [{ type: 'SERVICE', id: 'LIST' }];
				}

				return [
					...result.data.map((service) => ({
						type: 'SERVICE' as const,
						id: service.id,
					})),
					{ type: 'SERVICE' as const, id: 'LIST' },
				];
			},
		}),

		getServiceById: build.query<ApiResponse<Service>, string>({
			query: (id) => ({
				url: `/services/${id}`,
				method: 'GET',
			}),
			providesTags: (_result, _error, id) => [{ type: 'SERVICE', id }],
		}),

		updateService: build.mutation<
			ApiResponse<Service>,
			{ id: string; body: UpdateServicePayload }
		>({
			query: ({ id, body }) => ({
				url: `/services/${id}`,
				method: 'PATCH',
				data: body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'SERVICE', id },
				{ type: 'SERVICE', id: 'LIST' },
				'APPOINTMENT',
				'QUEUE',
				'DASHBOARD',
			],
		}),

		deleteService: build.mutation<ApiResponse<null>, string>({
			query: (id) => ({
				url: `/services/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'SERVICE', id },
				{ type: 'SERVICE', id: 'LIST' },
				'APPOINTMENT',
				'QUEUE',
				'DASHBOARD',
			],
		}),
	}),
});

export const {
	useCreateServiceMutation,
	useGetServicesQuery,
	useGetServiceByIdQuery,
	useUpdateServiceMutation,
	useDeleteServiceMutation,
} = serviceApi;
