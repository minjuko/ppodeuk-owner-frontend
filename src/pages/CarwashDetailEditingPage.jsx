import { Suspense } from "react";
import CarwashDetailEditingTemplate from "../components/templates/CarwashDetailEditingTemplate";
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

const CarwashDetailEditingPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="매장 정보를 불러오는 중입니다." />
        }
      >
        <CarwashDetailEditingTemplate />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CarwashDetailEditingPage;
