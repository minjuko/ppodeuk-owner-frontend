import { Suspense } from "react";
import CarwashBayReservationHistoryTemplate from "../components/templates/CarwashBayReservationHistoryTemplate";
import { ErrorBoundary } from "react-error-boundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import FallbackLayout from "../components/atoms/FallbackLayout";

const ErrorFallback = ({ error }) => {
  const errorCode = error?.response?.data?.error?.code;

  switch (errorCode) {
    case "1301":
      return (
        <FallbackLayout
          message="베이를 찾을 수 없습니다."
          buttonLabel="이전으로"
          to={-1}
        />
      );
  }

  return (
    <FallbackLayout
      message="알 수 없는 오류가 발생했습니다."
      buttonLabel="홈으로"
      to="/"
    />
  );
};

const CarwashBayReservationHistoryPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="예약 내역을 불러오는 중입니다." />
        }
      >
        <CarwashBayReservationHistoryTemplate />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CarwashBayReservationHistoryPage;
