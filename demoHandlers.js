import { rest } from "msw";

const ok = (response) => ({ success: true, response, error: null });

const carwashes = [
  {
    id: 1001,
    carwashId: 1001,
    name: "버블샤인 세차장",
    optime: {
      weekday: { start: "09:00", end: "22:00" },
      weekend: { start: "10:00", end: "20:00" },
    },
    imageList: [{ id: 501, url: "/noimage.png" }],
    imageFileList: [{ id: 501, url: "/noimage.png" }],
    monthlySales: 780000,
    monthlyReservations: 52,
    bayReservationList: [
      {
        bayId: 2001,
        bayNo: 1,
        status: 1,
        bayBookedTimeList: [
          { startTime: "10:00", endTime: "11:00" },
          { startTime: "14:00", endTime: "15:30" },
        ],
      },
      { bayId: 2002, bayNo: 2, status: 1, bayBookedTimeList: [] },
    ],
  },
  {
    id: 1002,
    carwashId: 1002,
    name: "클린웨이 세차장",
    optime: {
      weekday: { start: "08:00", end: "21:00" },
      weekend: { start: "09:00", end: "19:00" },
    },
    imageList: [{ id: 502, url: "/noimage.png" }],
    imageFileList: [{ id: 502, url: "/noimage.png" }],
    monthlySales: 480000,
    monthlyReservations: 32,
    bayReservationList: [
      { bayId: 2011, bayNo: 1, status: 1, bayBookedTimeList: [] },
    ],
  },
];

const reservations = [
  {
    reservation: {
      reservationId: 7001,
      bayNo: 1,
      nickname: "김포도",
      totalPrice: 12000,
      startTime: "2026-10-12T10:00:00",
      endTime: "2026-10-12T11:00:00",
    },
    carwash: { name: "버블샤인 세차장" },
  },
  {
    reservation: {
      reservationId: 7002,
      bayNo: 2,
      nickname: "이세차",
      totalPrice: 18000,
      startTime: "2026-10-14T14:00:00",
      endTime: "2026-10-14T15:30:00",
    },
    carwash: { name: "클린웨이 세차장" },
  },
];

const findCarwash = (params) =>
  carwashes.find((item) => item.id === Number(params.carwashId)) ??
  carwashes[0];

export const demoHandlers = [
  rest.post("*/api/open/login/owner", async (req, res, ctx) => {
    const credentials = await req.json();
    if (
      credentials.email !== "test-owner@example.com" ||
      credentials.password !== "test1234!"
    ) {
      return res(
        ctx.status(401),
        ctx.json({ success: false, response: null, error: { code: "1201" } }),
      );
    }
    return res(
      ctx.set("Authorization", "Bearer owner-demo-token"),
      ctx.json(ok(null)),
    );
  }),
  rest.get("*/api/common/member/info", (req, res, ctx) =>
    res(ctx.json(ok({ name: "데모 사장님" }))),
  ),
  rest.get("*/api/owner/home", (req, res, ctx) =>
    res(
      ctx.json(
        ok({
          monthlySales: 1260000,
          salesGrowthPercentage: 8.4,
          monthlyReservations: 84,
          reservationGrowthPercentage: 6.2,
          carwashInfoList: carwashes,
        }),
      ),
    ),
  ),
  rest.get("*/api/owner/carwashes", (req, res, ctx) =>
    res(ctx.json(ok({ carwashList: carwashes }))),
  ),
  rest.get("*/api/owner/carwashes/:carwashId/details", (req, res, ctx) => {
    const carwash = findCarwash(req.params);
    return res(
      ctx.json(
        ok({
          ...carwash,
          locationDTO: {
            address: "광주광역시 북구 첨단과기로 123",
            latitude: 35.228,
            longitude: 126.842,
          },
          tel: "062-123-4567",
          price: 6000,
          keywordIdList: [8, 10, 12],
          description: "예약제로 운영하는 깨끗한 셀프 세차장입니다.",
        }),
      ),
    );
  }),
  rest.get("*/api/owner/carwashes/:carwashId", (req, res, ctx) =>
    res(ctx.json(ok(findCarwash(req.params)))),
  ),
  rest.get("*/api/owner/sales", (req, res, ctx) => {
    const ids = req.url.searchParams.get("carwash-ids");
    if (!ids) {
      return res(
        ctx.json(
          ok({
            carwashList: carwashes.map(({ carwashId, name }) => ({
              carwashId,
              name,
            })),
          }),
        ),
      );
    }
    return res(
      ctx.json(
        ok({
          reservationList: reservations,
          page: { number: 0, size: 20, totalElements: reservations.length },
        }),
      ),
    );
  }),
  rest.get("*/api/owner/revenue", (req, res, ctx) =>
    res(ctx.json(ok({ revenue: 1260000 }))),
  ),
  rest.get("*/api/owner/reservations/:bayId", (req, res, ctx) =>
    res(
      ctx.json(
        ok({
          bayNo: 1,
          reservationList: reservations,
          page: { number: 0, size: 20, totalElements: reservations.length },
        }),
      ),
    ),
  ),
  rest.get("*/api/owner/bays/:bayId/revenue", (req, res, ctx) =>
    res(ctx.json(ok({ revenue: 300000 }))),
  ),
  rest.post("*/api/owner/carwashes/:carwashId/bays", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
  rest.put("*/api/owner/bays/:bayId/status", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
  rest.put("*/api/owner/carwashes/:carwashId/details", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
  rest.delete("*/api/owner/bays/:bayId", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
  rest.delete("*/api/owner/images/:imageId", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
  rest.delete("*/api/user/reservations/:reservationId", (req, res, ctx) =>
    res(ctx.json(ok(null))),
  ),
];
