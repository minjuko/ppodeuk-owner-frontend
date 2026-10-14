import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SalesManagementTemplate from "./SalesManagementTemplate";
import { getRevenue, getSales } from "../../apis/extras";

vi.mock("../../apis/extras", () => ({
  getSales: vi.fn(),
  getRevenue: vi.fn(),
}));
vi.mock("../organisms/MonthSelectorCard", () => ({
  default: ({ monthlyRevenue, isLoading, isError, onRetry }) => (
    <div>
      {isLoading ? "revenue-loading" : null}
      {isError ? "revenue-error" : null}
      {isError ? <button onClick={onRetry}>retry-revenue</button> : null}
      {monthlyRevenue == null ? null : `monthly:${monthlyRevenue}`}
    </div>
  ),
}));
vi.mock("../organisms/SalesItem", () => ({
  default: ({ reservationId }) => <div>sale:{reservationId}</div>,
}));

const renderTemplate = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SalesManagementTemplate />
    </QueryClientProvider>,
  );
};

describe("SalesManagementTemplate", () => {
  beforeEach(() => {
    getSales.mockImplementation((carwashIds) => {
      if (carwashIds.length === 0) {
        return Promise.resolve({
          data: {
            response: {
              carwashList: [{ carwashId: 1001, name: "테스트 세차장" }],
            },
          },
        });
      }

      return Promise.resolve({
        data: {
          response: {
            reservationList: [
              { reservation: { reservationId: 77 }, carwash: {} },
            ],
          },
        },
      });
    });
    getRevenue.mockResolvedValue({ data: { response: { revenue: 8000 } } });
  });

  test("waits for owned carwash IDs before requesting revenue", async () => {
    renderTemplate();

    expect(await screen.findByText("monthly:8000")).toBeVisible();
    expect(screen.getByText("sale:77")).toBeVisible();

    await waitFor(() => {
      expect(getRevenue).toHaveBeenCalledWith([1001], expect.any(String));
    });
    expect(getRevenue).not.toHaveBeenCalledWith([], expect.any(String));
  });

  test("shows independent loading feedback while sales and revenue are pending", async () => {
    getSales.mockImplementation((carwashIds) => {
      if (carwashIds.length === 0) {
        return Promise.resolve({
          data: {
            response: {
              carwashList: [{ carwashId: 1001, name: "test carwash" }],
            },
          },
        });
      }
      return new Promise(() => {});
    });
    getRevenue.mockReturnValue(new Promise(() => {}));

    renderTemplate();

    expect(await screen.findByText("revenue-loading")).toBeVisible();
    expect(screen.getByRole("status")).toBeVisible();
  });

  test("keeps section failures local and exposes revenue retry", async () => {
    getSales.mockImplementation((carwashIds) => {
      if (carwashIds.length === 0) {
        return Promise.resolve({
          data: {
            response: {
              carwashList: [{ carwashId: 1001, name: "test carwash" }],
            },
          },
        });
      }
      return Promise.reject(new Error("sales unavailable"));
    });
    getRevenue.mockRejectedValue(new Error("revenue unavailable"));

    renderTemplate();

    expect(await screen.findByText("revenue-error")).toBeVisible();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "retry-revenue" })).toBeVisible();
    expect(getSales).toHaveBeenCalledTimes(2);
    expect(getRevenue).toHaveBeenCalledTimes(1);
  });
});
