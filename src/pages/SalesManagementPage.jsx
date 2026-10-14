import { Suspense } from "react";
import SalesManagementTemplate from "../components/templates/SalesManagementTemplate";
import { ErrorBoundary } from "react-error-boundary";
import SectionSkeleton from "../components/feedback/SectionSkeleton";
import FallbackLayout from "../components/atoms/FallbackLayout";

const ErrorFallback = ({ error }) => {
  const errorCode = error?.response?.data?.error?.code;

  switch (errorCode) {
    case "1003":
      return (
        <FallbackLayout
          message="일시적인 오류로 데이터를 불러올 수 없습니다."
          buttonLabel="홈으로"
          to="/"
        />
      );
    case "1101":
      return (
        <FallbackLayout
          message="인증에 오류가 발생했습니다. 다시 로그인 해주세요."
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

const SalesManagementPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense
        fallback={
          <SectionSkeleton rows={5} label="매출 정보를 불러오는 중입니다." />
        }
      >
        <SalesManagementTemplate />
      </Suspense>
    </ErrorBoundary>
  );
};

export default SalesManagementPage;
