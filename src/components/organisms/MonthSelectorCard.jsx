import { useState } from "react";
import Button from "../atoms/Button";
import Card from "../molecules/Card";
import dayjs from "dayjs";
import { getDemoDate } from "../../utils/demoDate";

/**
 * MonthSelectorCard 컴포넌트
 *
 * 월 선택 카드입니다.
 *
 * @param {Function} onChange - 월 선택 시 호출되는 함수
 * @param {Number} monthlyRevenue - 월 매출
 */
const MonthSelectorCard = ({
  onChange,
  monthlyRevenue,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const formatYearMonth = (date) => date.format("YYYY-MM");

  const [yearMonth, setYearMonth] = useState(
    formatYearMonth(dayjs(getDemoDate())),
  );

  const incrementMonth = () => {
    const newDate = dayjs(yearMonth).add(1, "month");
    const formattedDate = formatYearMonth(newDate);
    setYearMonth(formattedDate);
    onChange(newDate.format("YYYY-MM-DD"));
  };

  const decrementMonth = () => {
    const newDate = dayjs(yearMonth).subtract(1, "month");
    const formattedDate = formatYearMonth(newDate);
    setYearMonth(formattedDate);
    onChange(newDate.format("YYYY-MM-DD"));
  };

  const [year, month] = yearMonth.split("-");

  return (
    <Card
      title={
        // 월 선택
        <div className="items-center flex-between">
          <Button className="w-6 h-12 select-none" onClick={decrementMonth}>
            ◀
          </Button>
          <div>
            <div>{year}년</div>
            <div className="text-4xl">{month}월</div>
          </div>
          <Button className="w-6 h-12 select-none" onClick={incrementMonth}>
            ▶
          </Button>
        </div>
      }
    >
      {/* 월 매출 */}
      {isLoading ? (
        <div className="py-1 text-center text-gray-500" role="status">
          월 매출을 불러오는 중입니다.
        </div>
      ) : isError ? (
        <div className="grid gap-2 text-center" role="alert">
          <span className="text-sm text-red-600">
            월 매출을 불러오지 못했습니다.
          </span>
          <Button onClick={onRetry}>다시 시도</Button>
        </div>
      ) : monthlyRevenue !== undefined && monthlyRevenue !== null ? (
        <div className="text-2xl font-semibold text-center text-primary">
          {monthlyRevenue.toLocaleString()}원
        </div>
      ) : null}
    </Card>
  );
};

export default MonthSelectorCard;
