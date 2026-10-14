import { Suspense } from "react";
import CarwashItemManagementTemplate from "../components/templates/CarwashItemManagementTemplate";
import { ErrorBoundary } from "react-error-boundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import FallbackLayout from "../components/atoms/FallbackLayout";

const ErrorFallback = ({ error }) => {
  const errorCode = error?.response?.data?.error?.code;

  switch (errorCode) {
    case "1301":
      return (
        <FallbackLayout
          message="세차장을 찾을 수 없습니다."
          buttonLabel="홈으로"
          to="/"
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

const CarwashItemManagementPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="베이 정보를 불러오는 중입니다." />
        }
      >
        <CarwashItemManagementTemplate />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CarwashItemManagementPage;
