import { instance } from "./instance";

export const getCarwashes = async (selectedDate) => {
  return instance.get("/api/owner/carwashes", {
    params: selectedDate ? { "selected-date": selectedDate } : undefined,
  });
};

export const getCarwashesDetails = async (carwash_id) => {
  return instance.get(`/api/owner/carwashes/${carwash_id}/details`);
};

export const putCarwashesDetails = async (carwash_id, data) => {
  return instance.put(`/api/owner/carwashes/${carwash_id}/details`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const register = async (data) => {
  return instance.post("/api/owner/carwashes/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addBays = async (data) => {
  const { carwash_id, bay_number } = data;
  return instance.post(`/api/owner/carwashes/${carwash_id}/bays`, {
    bayNum: bay_number,
  });
};

export const getCarwashItem = async (carwash_id, selectedDate) => {
  return instance.get(`/api/owner/carwashes/${carwash_id}`, {
    params: selectedDate ? { "selected-date": selectedDate } : undefined,
  });
};

export const deleteImage = async (image_id) => {
  return instance.delete(`/api/owner/images/${image_id}`);
};

export const getCarwashBayReservationHistory = async (
  bay_id,
  selected_date,
  page = 0,
  size = 20,
) => {
  return instance.get(`/api/owner/reservations/${bay_id}`, {
    params: { "selected-date": selected_date, page, size },
  });
};

export const cancelReservation = async (reservation_id) => {
  return instance.delete(`/api/user/reservations/${reservation_id}`);
};

export const getBayRevenue = async (bay_id, selected_date) => {
  return instance.get(`/api/owner/bays/${bay_id}/revenue`, {
    params: selected_date ? { "selected-date": selected_date } : undefined,
  });
};
