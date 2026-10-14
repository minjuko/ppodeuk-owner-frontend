import { instance } from "./instance";

// 홈화면 데이터
export const getHome = async (selectedDate) => {
  return instance.get("/api/owner/home", {
    params: selectedDate ? { "selected-date": selectedDate } : undefined,
  });
};

// 베이 활성화 비활성화
export const setBayStatus = async (data) => {
  // console.log(bay_id, status);
  const { bay_id, status } = data;
  return instance.put(`/api/owner/bays/${bay_id}/status?status=${status}`);
};

// 매출관리 데이터
export const getSales = async (
  carwash_id,
  selected_date,
  selected_at,
  page = 0,
  size = 20,
) => {
  return instance.get("/api/owner/sales", {
    params: {
      ...(carwash_id?.length ? { "carwash-ids": carwash_id.join(",") } : {}),
      "selected-date": selected_date,
      "selected-at": selected_at,
      page,
      size,
    },
  });
};

export const deleteBay = async (bay_id) => {
  return instance.delete(`/api/owner/bays/${bay_id}`);
};

// 월 매출 데이터
export const getRevenue = async (carwash_id, selected_date) => {
  return instance.get("/api/owner/revenue", {
    params: {
      ...(carwash_id?.length ? { "carwash-ids": carwash_id.join(",") } : {}),
      "selected-date": selected_date,
    },
  });
};
