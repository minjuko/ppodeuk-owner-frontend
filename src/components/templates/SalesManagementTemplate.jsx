import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Checkbox from "../atoms/CheckBox";
import Card from "../molecules/Card";
import MonthSelectorCard from "../organisms/MonthSelectorCard";
import SalesItem from "../organisms/SalesItem";
import { getRevenue, getSales } from "../../apis/extras";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { isEmpty } from "../../utils/isEmpty";
import MainContentLayout from "../atoms/MainContentLayout";
import AsideLayout from "../atoms/AsideLayout";
import { getDemoDate } from "../../utils/demoDate";
import InlineError from "../feedback/InlineError";
import SectionSkeleton from "../feedback/SectionSkeleton";
import Pagination from "../molecules/Pagination";
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

/**
 * SalesManagementTemplate 템플릿
 *
 * aside 영역과 section 영역으로 구성되어 있습니다.
 * aside 영역에는 월 선택 카드와 매장 선택 체크박스가 있고, section 영역에는 개별 매출내역 아이템들이 보여집니다.
 */
const SalesManagementTemplate = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [selectedCarwash, setSelectedCarwash] = useState([]);
  const [selectionInitialized, setSelectionInitialized] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(getDemoDate()).startOf("month").format("YYYY-MM-DD"),
  );
  const selectedAt = dayjs(getDemoDate()).format("YYYY-MM-DDTHH:mm:ss");

  const setDate = (newDate) => {
    setSelectedDate(newDate);
    setPage(1);
  };

  const { data: carwashData } = useSuspenseQuery({
    queryKey: ["sales-carwashes"],
    queryFn: () => getSales([], selectedDate, selectedAt),
  });

  const carwashList = useMemo(
    () => carwashData?.data?.response?.carwashList ?? [],
    [carwashData],
  );
  const allCarwashIds = useMemo(
    () => carwashList.map((item) => item?.carwashId),
    [carwashList],
  );
  const hasSelection = selectedCarwash.length > 0;

  const salesQuery = useQuery({
    queryKey: ["sales", selectedCarwash, selectedDate, selectedAt, page],
    queryFn: () =>
      getSales(selectedCarwash, selectedDate, selectedAt, page - 1, pageSize),
    enabled: hasSelection,
    placeholderData: (previousData) => previousData,
  });
  const revenueQuery = useQuery({
    queryKey: ["revenue", selectedCarwash, selectedDate],
    queryFn: () => getRevenue(selectedCarwash, selectedDate),
    enabled: hasSelection,
    placeholderData: (previousData) => previousData,
  });

  const handleCheck = (carwashId) => (e) => {
    let updatedSelectedCarwash;
    if (e.target.checked) {
      updatedSelectedCarwash = [...selectedCarwash, carwashId];
    } else {
      updatedSelectedCarwash = selectedCarwash.filter(
        (item) => item !== carwashId,
      );
    }
    setSelectedCarwash(updatedSelectedCarwash);
    setPage(1);
  };

  const reservationList =
    salesQuery.data?.data?.response?.reservationList ?? [];
  const totalReservations =
    salesQuery.data?.data?.response?.page?.totalElements ??
    reservationList.length;
  const revenue = revenueQuery.data?.data?.response?.revenue;
  const isAllSelected =
    allCarwashIds.length > 0 &&
    allCarwashIds.every((carwashId) => selectedCarwash.includes(carwashId));

  useEffect(() => {
    if (selectionInitialized || allCarwashIds.length === 0) return;

    setSelectedCarwash(allCarwashIds);
    setSelectionInitialized(true);
  }, [allCarwashIds, selectionInitialized]);

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:gap-16">
      <AsideLayout>
        <MonthSelectorCard
          onChange={setDate}
          monthlyRevenue={revenue}
          isLoading={revenueQuery.isPending || revenueQuery.isFetching}
          isError={revenueQuery.isError}
          onRetry={() => revenueQuery.refetch()}
        />
        <Card title="매장별 선택">
          <div className="flex flex-col">
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => {
                setSelectedCarwash(e.target.checked ? allCarwashIds : []);
                setPage(1);
              }}
            >
              전체 선택
            </Checkbox>
            {carwashList?.map((item) => (
              <Checkbox
                key={item?.carwashId}
                checked={selectedCarwash.includes(item?.carwashId)}
                onChange={handleCheck(item?.carwashId)}
              >
                {item?.name}
              </Checkbox>
            ))}
          </div>
        </Card>
      </AsideLayout>
      <MainContentLayout>
        {salesQuery.isPending ? (
          <SectionSkeleton rows={4} label="매출 내역을 불러오는 중입니다." />
        ) : salesQuery.isError ? (
          <InlineError
            message="매출 내역을 불러오지 못했습니다."
            onRetry={() => salesQuery.refetch()}
          />
        ) : isEmpty(reservationList) ? (
          <div className="flex-col justify-center w-auto flex-items-center-8">
            <div className="text-xl">매출내역이 없습니다.</div>
          </div>
        ) : (
          <>
            {reservationList.map((item) => (
              <SalesItem
                key={item?.reservation?.reservationId}
                reservationId={item?.reservation?.reservationId}
                carwashName={item?.carwash?.name}
                bayNo={item?.reservation?.bayNo}
                nickname={item?.reservation?.nickname}
                totalPrice={item?.reservation?.totalPrice}
                startTime={item?.reservation?.startTime}
                endTime={item?.reservation?.endTime}
              />
            ))}
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalReservations}
              onPageChange={setPage}
            />
          </>
        )}
      </MainContentLayout>
    </div>
  );
};

export default SalesManagementTemplate;
