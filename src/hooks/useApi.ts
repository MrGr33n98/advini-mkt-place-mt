import { useState, useEffect, useCallback } from 'react';
import { 
  lawyersApi, 
  appointmentsApi, 
  reviewsApi, 
  specializationsApi,
  Lawyer,
  Appointment,
  Review,
  Specialization,
  PaginationInfo
} from '@/lib/api';

// Generic hook for API operations
export function useApiState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Lawyers hooks
export function useLawyers(params?: Parameters<typeof lawyersApi.getAll>[0]) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyers = useCallback(async (newParams?: typeof params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await lawyersApi.getAll(newParams || params);
      setLawyers(response.lawyers);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lawyers';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  const refetch = useCallback(() => fetchLawyers(), [fetchLawyers]);

  return { lawyers, pagination, loading, error, refetch, fetchLawyers };
}

export function useLawyer(id: number | null) {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyer = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await lawyersApi.getById(id);
      setLawyer(response.lawyer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lawyer';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLawyer();
  }, [fetchLawyer]);

  const refetch = useCallback(() => fetchLawyer(), [fetchLawyer]);

  return { lawyer, loading, error, refetch };
}

export function useLawyerMutations() {
  const createLawyer = useApiState<{ lawyer: Lawyer }>();
  const updateLawyer = useApiState<{ lawyer: Lawyer }>();
  const deleteLawyer = useApiState<void>();

  const create = useCallback((lawyer: Partial<Lawyer>) => {
    return createLawyer.execute(() => lawyersApi.create(lawyer));
  }, [createLawyer.execute]);

  const update = useCallback((id: number, lawyer: Partial<Lawyer>) => {
    return updateLawyer.execute(() => lawyersApi.update(id, lawyer));
  }, [updateLawyer.execute]);

  const remove = useCallback((id: number) => {
    return deleteLawyer.execute(() => lawyersApi.delete(id));
  }, [deleteLawyer.execute]);

  return {
    create: { ...createLawyer, execute: create },
    update: { ...updateLawyer, execute: update },
    delete: { ...deleteLawyer, execute: remove },
  };
}

// Appointments hooks
export function useAppointments(params?: Parameters<typeof appointmentsApi.getAll>[0]) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (newParams?: typeof params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await appointmentsApi.getAll(newParams || params);
      setAppointments(response.appointments);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const refetch = useCallback(() => fetchAppointments(), [fetchAppointments]);

  return { appointments, pagination, loading, error, refetch, fetchAppointments };
}

export function useAppointment(id: number | null) {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointment = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await appointmentsApi.getById(id);
      setAppointment(response.appointment);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const refetch = useCallback(() => fetchAppointment(), [fetchAppointment]);

  return { appointment, loading, error, refetch };
}

export function useAppointmentMutations() {
  const createAppointment = useApiState<{ appointment: Appointment }>();
  const updateAppointment = useApiState<{ appointment: Appointment }>();
  const deleteAppointment = useApiState<void>();

  const create = useCallback((appointment: Partial<Appointment>) => {
    return createAppointment.execute(() => appointmentsApi.create(appointment));
  }, [createAppointment.execute]);

  const update = useCallback((id: number, appointment: Partial<Appointment>) => {
    return updateAppointment.execute(() => appointmentsApi.update(id, appointment));
  }, [updateAppointment.execute]);

  const remove = useCallback((id: number) => {
    return deleteAppointment.execute(() => appointmentsApi.delete(id));
  }, [deleteAppointment.execute]);

  return {
    create: { ...createAppointment, execute: create },
    update: { ...updateAppointment, execute: update },
    delete: { ...deleteAppointment, execute: remove },
  };
}

export function useAvailableSlots(lawyer_id: number | null, date: string | null) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!lawyer_id || !date) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await appointmentsApi.getAvailableSlots(lawyer_id, date);
      setSlots(response.available_slots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available slots';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [lawyer_id, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const refetch = useCallback(() => fetchSlots(), [fetchSlots]);

  return { slots, loading, error, refetch };
}

// Reviews hooks
export function useReviews(params?: Parameters<typeof reviewsApi.getAll>[0]) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (newParams?: typeof params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.getAll(newParams || params);
      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const refetch = useCallback(() => fetchReviews(), [fetchReviews]);

  return { reviews, pagination, loading, error, refetch, fetchReviews };
}

export function useReviewMutations() {
  const createReview = useApiState<{ review: Review }>();
  const updateReview = useApiState<{ review: Review }>();
  const deleteReview = useApiState<void>();

  const create = useCallback((review: Partial<Review>) => {
    return createReview.execute(() => reviewsApi.create(review));
  }, [createReview.execute]);

  const update = useCallback((id: number, review: Partial<Review>) => {
    return updateReview.execute(() => reviewsApi.update(id, review));
  }, [updateReview.execute]);

  const remove = useCallback((id: number) => {
    return deleteReview.execute(() => reviewsApi.delete(id));
  }, [deleteReview.execute]);

  return {
    create: { ...createReview, execute: create },
    update: { ...updateReview, execute: update },
    delete: { ...deleteReview, execute: remove },
  };
}

export function useReviewStats(lawyer_id?: number) {
  const [stats, setStats] = useState<{
    total_reviews: number;
    average_rating: number;
    rating_distribution: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await reviewsApi.getStats(lawyer_id);
      setStats(response.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch review stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [lawyer_id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refetch = useCallback(() => fetchStats(), [fetchStats]);

  return { stats, loading, error, refetch };
}

// Specializations hooks
export function useSpecializations(params?: Parameters<typeof specializationsApi.getAll>[0]) {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecializations = useCallback(async (newParams?: typeof params) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await specializationsApi.getAll(newParams || params);
      setSpecializations(response.specializations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch specializations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchSpecializations();
  }, [fetchSpecializations]);

  const refetch = useCallback(() => fetchSpecializations(), [fetchSpecializations]);

  return { specializations, loading, error, refetch, fetchSpecializations };
}

export function useSpecializationMutations() {
  const createSpecialization = useApiState<{ specialization: Specialization }>();
  const updateSpecialization = useApiState<{ specialization: Specialization }>();
  const deleteSpecialization = useApiState<void>();

  const create = useCallback((specialization: Partial<Specialization>) => {
    return createSpecialization.execute(() => specializationsApi.create(specialization));
  }, [createSpecialization.execute]);

  const update = useCallback((id: number, specialization: Partial<Specialization>) => {
    return updateSpecialization.execute(() => specializationsApi.update(id, specialization));
  }, [updateSpecialization.execute]);

  const remove = useCallback((id: number) => {
    return deleteSpecialization.execute(() => specializationsApi.delete(id));
  }, [deleteSpecialization.execute]);

  return {
    create: { ...createSpecialization, execute: create },
    update: { ...updateSpecialization, execute: update },
    delete: { ...deleteSpecialization, execute: remove },
  };
}