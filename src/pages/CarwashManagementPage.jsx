import { Suspense } from "react";
import CarwashManagementTemplate from "../components/templates/CarwashManagementTemplate";
import { ErrorBoundary } from "react-error-boundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import FallbackLayout from "../components/atoms/FallbackLayout";

const ErrorFallback = ({ error }) => {
  const errorCode = error?.response?.data?.error?.code;

  switch (errorCode) {
    case "1201":
      return (
        <FallbackLayout
          message="로그인이 필요한 페이지입니다."
          buttonLabel="로그인"
          to="/login"
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

const CarwashManagementPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <SectionSkeleton rows={4} label="매장 목록을 불러오는 중입니다." />
        }
      >
        <CarwashManagementTemplate />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CarwashManagementPage;
