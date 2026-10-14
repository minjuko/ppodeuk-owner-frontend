import RegisterForm from "../components/organisms/RegisterForm";
import Box from "../components/atoms/Box";
import { useMutation } from "@tanstack/react-query";
import { register } from "../apis/carwashes";
import useRegisterForm from "../hooks/useRegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import FallbackLayout from "../components/atoms/FallbackLayout";
import { getUserInfoThunk } from "../store/slices/authSlice";
import { useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToast } from "../components/feedback/ToastProvider";

const ErrorFallback = ({ resetErrorBoundary }) => {
  return (
    <FallbackLayout
      message="데이터를 불러오는 중 오류가 발생했습니다."
      resetErrorBoundary={resetErrorBoundary}
    />
  );
};

const RegisterPage = () => {
  const userName = useSelector((state) => state.auth.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!userName) {
      dispatch(getUserInfoThunk())
        .then(unwrapResult)
        .catch(() => {
          localStorage.removeItem("Token");
          navigate("/login");
        });
    }
  }, [dispatch, navigate, userName]);

  const errorHandler = (error) => {
    const errorCode = error?.response?.data?.error?.code;

    switch (errorCode) {
      case "1201":
        showToast({
          message: "인증이 만료되었습니다. 다시 로그인해 주세요.",
          tone: "error",
        });
        navigate("/login");
        break;
      case "1003":
        showToast({ message: "필수 입력값을 확인해 주세요.", tone: "error" });
        break;
      default:
        showToast({
          message: "입점 신청에 실패했습니다. 잠시 후 다시 시도해 주세요.",
          tone: "error",
        });
        break;
    }
  };

  const mutation = useMutation({
    mutationFn: (inputs) => {
      const formData = new FormData();
      const blob = new Blob(
        [
          JSON.stringify({
            name: inputs.carwashName,
            location: {
              address: inputs.carwashAddress,
              latitude: inputs.latitude,
              longitude: inputs.longitude,
            },
            price: inputs.pricePer30min,
            optime: {
              weekday: {
                start: inputs.weekdayOpenTime,
                end: inputs.weekdayCloseTime,
              },
              weekend: {
                start: inputs.weekendOpenTime,
                end: inputs.weekendCloseTime,
              },
            },
            keywordIdList: inputs.keypoint,
            description: inputs.carwashDescription,
            tel: inputs.carwashTel,
          }),
        ],
        { type: "application/json" },
      );

      inputs.carwashImage.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("carwash", blob);

      return register(formData);
    },
    onSuccess: () => {
      showToast({ message: "세차장이 등록되었습니다." });
      navigate("/");
    },
    onError: errorHandler,
  });

  const initialValue = {
    carwashName: "",
    carwashAddress: "",
    latitude: "",
    longitude: "",
    carwashTel: "",
    pricePer30min: "",
    weekdayOpenTime: "",
    weekdayCloseTime: "",
    weekendOpenTime: "",
    weekendCloseTime: "",
    keypoint: [],
    carwashImage: [],
    carwashDescription: "",
  };

  const { inputs, handleChange, isDirty } = useRegisterForm(initialValue);

  return (
    <div className="items-center w-full min-h-screen py-8 flex-center">
      <Box className="relative grid-8 p-14">
        <button
          type="button"
          aria-label="입점신청 닫기"
          onClick={() => navigate("/")}
          className="absolute text-3xl leading-none text-gray-400 transition-colors right-6 top-6 hover:text-gray-700"
        >
          ×
        </button>
        {/*제목 텍스트*/}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="text-center grid-4">
            <h1 className="text-3xl font-bold">
              {userName} 사장님, 입점을 환영합니다!
            </h1>
            <div className="text-gray-500">아래 정보들을 입력해주세요.</div>
          </div>

          <RegisterForm
            inputs={inputs}
            onChange={handleChange}
            mutation={mutation}
            isDirty={isDirty}
            buttonLabel="입점신청"
          />
        </ErrorBoundary>
      </Box>
    </div>
  );
};

export default RegisterPage;
