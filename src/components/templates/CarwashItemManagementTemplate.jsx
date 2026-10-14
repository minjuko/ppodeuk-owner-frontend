import { useNavigate, useParams } from "react-router-dom";
import Card from "../molecules/Card";
import CarwashBayItem from "../organisms/CarwashBayItem";
import { useMutation } from "@tanstack/react-query";
import { addBays } from "../../apis/carwashes";
import { isEmpty } from "../../utils/isEmpty";
import AsideLayout from "../atoms/AsideLayout";
import MainContentLayout from "../atoms/MainContentLayout";
import Button from "../atoms/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCarwashItemThunk } from "../../store/slices/carwashSlice";
import dayjs from "dayjs";
import AsyncButton from "../feedback/AsyncButton";
import InlineError from "../feedback/InlineError";
import { useToast } from "../feedback/ToastProvider";

const CarwashItemManagementTemplate = () => {
  const { carwash_id } = useParams();
  const selectedDate = dayjs(Date.now()).format("YYYY-MM-DD");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isBayModalOpen, setIsBayModalOpen] = useState(false);
  const [bayNumber, setBayNumber] = useState("");
  const [bayError, setBayError] = useState("");

  const errorHandler = (error) => {
    const errorCode = error?.response?.data?.error?.code;

    switch (errorCode) {
      case "1201":
        showToast({
          message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
          tone: "error",
        });
        navigate("/login");
        break;
      case "1301":
        showToast({ message: "세차장을 찾을 수 없습니다.", tone: "error" });
        navigate("/manage");
        break;
      case "1001":
        setBayError(
          "이미 사용 중인 베이 번호입니다. 다른 번호를 입력해주세요.",
        );
        break;
      case "1002":
        setBayError("베이 번호는 숫자로 입력해주세요.");
        break;
      case "1102":
        showToast({ message: "접근 권한이 없습니다.", tone: "error" });
        navigate("/");
        break;
      default:
        showToast({
          message: "베이를 추가하지 못했습니다. 잠시 후 다시 시도해주세요.",
          tone: "error",
        });
        break;
    }
  };

  const {
    id,
    name,
    monthlySales,
    monthlyReservations,
    optime,
    bayReservationList,
  } = useSelector((state) => state.carwash);

  useEffect(() => {
    dispatch(getCarwashItemThunk({ carwashId: carwash_id, selectedDate }));
  }, [carwash_id, dispatch, selectedDate]);

  const mutation = useMutation({
    mutationFn: (data) => addBays(data),
    onSuccess: () => {
      dispatch(getCarwashItemThunk({ carwashId: carwash_id, selectedDate }));
      setBayNumber("");
      setBayError("");
      setIsBayModalOpen(false);
      showToast({ message: "베이가 추가되었습니다." });
    },
    onError: errorHandler,
  });

  const submitBay = (event) => {
    event.preventDefault();
    if (!/^\d+$/.test(bayNumber)) {
      setBayError("베이 번호는 숫자로 입력해주세요.");
      return;
    }
    setBayError("");
    mutation.mutate({ carwash_id, bay_number: bayNumber });
  };

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:gap-16">
      <AsideLayout>
        <Card title={name}>
          <div className="grid-2">
            <div>
              <div className="flex-between">
                <h3 className="font-semibold">이번 달 매출</h3>
                <div>{monthlySales?.toLocaleString()}원</div>
              </div>
              <div className="flex-between">
                <h3 className="font-semibold">이번 달 예약</h3>
                <div>{monthlyReservations?.toLocaleString()}건</div>
              </div>
            </div>
          </div>
        </Card>
        <Button
          type="button"
          variant="aside"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/manage/item/${carwash_id}/edit`);
          }}
        >
          세차장 정보 수정
        </Button>
        <Button
          type="button"
          variant="aside"
          onClick={(e) => {
            e.preventDefault();

            setIsBayModalOpen(true);
          }}
        >
          베이 추가
        </Button>
      </AsideLayout>
      {isBayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <form
            onSubmit={submitBay}
            className="relative w-full max-w-sm p-6 bg-white shadow-2xl rounded-xl"
          >
            <button
              type="button"
              aria-label="베이 추가 닫기"
              onClick={() => setIsBayModalOpen(false)}
              disabled={mutation.isPending}
              className="absolute text-2xl leading-none text-gray-400 right-5 top-5 hover:text-gray-700"
            >
              ×
            </button>
            <h2 className="mb-4 text-xl font-semibold">베이 추가</h2>
            <label
              className="block mb-2 text-sm text-gray-600"
              htmlFor="bay-number"
            >
              추가할 베이 번호
            </label>
            <input
              id="bay-number"
              autoFocus
              inputMode="numeric"
              value={bayNumber}
              onChange={(event) => {
                setBayNumber(event.target.value);
                setBayError("");
              }}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 outline-none rounded-xl"
              placeholder="예: 4"
            />
            {bayError ? <InlineError message={bayError} /> : null}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="small"
                onClick={() => setIsBayModalOpen(false)}
                disabled={mutation.isPending}
              >
                취소
              </Button>
              <AsyncButton
                type="submit"
                variant="cta"
                isPending={mutation.isPending}
                pendingLabel="추가 중..."
              >
                추가하기
              </AsyncButton>
            </div>
          </form>
        </div>
      )}
      <MainContentLayout>
        {isEmpty(bayReservationList) ? (
          <div className="flex-col justify-center w-auto flex-items-center-8">
            <div className="text-xl">
              등록된 베이가 없습니다. 먼저 베이를 추가해주세요.
            </div>
          </div>
        ) : (
          bayReservationList.map((item) => {
            return (
              <CarwashBayItem
                key={item?.bayId}
                carwashId={id}
                selectedDate={selectedDate}
                optime={optime}
                bay={item}
              />
            );
          })
        )}
      </MainContentLayout>
    </div>
  );
};

export default CarwashItemManagementTemplate;
