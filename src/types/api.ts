export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
  timestamp?: string;
}

export type AppointmentStatus =
  | "WAITING"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type StaffAvailability = "AVAILABLE" | "ON_LEAVE";

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  staffType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServicePayload {
  name: string;
  durationMinutes: number;
  staffType: string;
}

export interface UpdateServicePayload {
  name?: string;
  durationMinutes?: number;
  staffType?: string;
}

export interface Staff {
  id: string;
  name: string;
  serviceType: string;
  dailyCapacity: number;
  availabilityStatus: StaffAvailability;
  createdAt?: string;
  updatedAt?: string;
}

export interface StaffWithLoad extends Staff {
  currentLoad: number;
  availableSlots: number;
  isAtCapacity: boolean;
}

export interface CreateStaffPayload {
  name: string;
  serviceType: string;
  dailyCapacity: number;
}

export interface UpdateStaffPayload {
  name?: string;
  serviceType?: string;
  dailyCapacity?: number;
  availabilityStatus?: StaffAvailability;
}

export interface Appointment {
  id: string;
  customerName: string;
  dateTime: string;
  endTime: string;
  status: AppointmentStatus;
  queuePosition: number | null;
  staffId: string | null;
  serviceId: string;
}

export interface AppointmentWithDetails extends Appointment {
  staff?: Staff | null;
  service?: Service | null;
}

export interface CreateAppointmentPayload {
  customerName: string;
  dateTime: string;
  serviceId: string;
  staffId?: string;
}

export interface UpdateAppointmentPayload {
  customerName?: string;
  dateTime?: string;
  staffId?: string | null;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  date?: string;
  staffId?: string;
  status?: AppointmentStatus;
}

export interface WaitingAppointment {
  id: string;
  customerName: string;
  dateTime: string;
  endTime: string;
  queuePosition: number | null;
  serviceId: string;
  service?: {
    name: string;
    durationMinutes: number;
    staffType: string;
  };
}

export interface QueueAssignPayload {
  staffId: string;
}

export interface DashboardSummary {
  totalAppointments: number;
  completed: number;
  scheduled: number;
  pending: number;
  waitingQueueCount: number;
}

export interface StaffLoadSummary {
  id: string;
  name: string;
  load: string;
  currentLoad: number;
  capacity: number;
  status: string;
  availabilityStatus: StaffAvailability | string;
}

export interface ActivityLogEntry {
  id: string;
  time: string;
  action: string;
  message: string;
}
