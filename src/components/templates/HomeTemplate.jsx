import DashboardItem from "../atoms/DashboardItem";
import CarwashShortcutItem from "../atoms/CarwashShortcutItem";
import SalesIcon from "/DashboardItem/salesIcon.svg";
import ReservationIcon from "/DashboardItem/reservationIcon.svg";
import { getHome } from "../../apis/extras";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getDemoDate } from "../../utils/demoDate";

const HomeTemplate = () => {
  const selectedDate = dayjs(getDemoDate()).format("YYYY-MM-DD");
  const { data } = useSuspenseQuery({
    queryKey: ["home", selectedDate],
    queryFn: () => getHome(selectedDate),
  });
  const userName = useSelector((state) => state.auth.userName);

  const carwashInfoList = data?.data?.response?.carwashInfoList;
  const monthlySales = data?.data?.response?.monthlySales;
  const monthlyReservations = data?.data?.response?.monthlyReservations;
  const reservationGrowthPercentage =
    data?.data?.response?.reservationGrowthPercentage;
  const salesGrowthPercentage = data?.data?.response?.salesGrowthPercentage;

  return (
    <div className="grid-8">
      <section className="grid-4">
        <h1 className="text-3xl font-bold">{userName} 사장님 안녕하세요!</h1>
        <div className="flex-12">
          <DashboardItem
            label="이번 달 전체 판매"
            icon={SalesIcon}
            number={monthlySales}
            unit="원"
            percentage={salesGrowthPercentage}
          />
          <DashboardItem
            label="이번 달 전체 예약"
            icon={ReservationIcon}
            number={monthlyReservations}
            unit="건"
            percentage={reservationGrowthPercentage}
          />
        </div>
      </section>

      <section className="grid-4">
        <h2 className="text-2xl font-bold">{userName} 사장님의 매장</h2>
        <div className="flex-wrap flex-12">
          {carwashInfoList?.map((store) => (
            <CarwashShortcutItem
              key={store?.carwashId}
              carwashId={store?.carwashId}
              name={store?.name}
              monthlySales={store?.monthlySales}
              monthlyReservations={store?.monthlyReservations}
              imageFileList={store?.imageFileList}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeTemplate;
