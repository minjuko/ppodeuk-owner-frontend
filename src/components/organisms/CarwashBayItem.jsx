import { useMutation } from "@tanstack/react-query";
import TimeTable from "../atoms/TimeTable";
import Toggle from "../atoms/Toggle";
import { deleteBay, setBayStatus } from "../../apis/extras";
import { Link, useNavigate } from "react-router-dom";
import WarningMessage from "../atoms/WarningMessage";
import { useDispatch } from "react-redux";
import { getCarwashItemThunk } from "../../store/slices/carwashSlice";
import { useToast } from "../feedback/ToastProvider";
import ConfirmModal from "../feedback/ConfirmModal";
import { useState } from "react";

const CarwashBayItem = ({ carwashId, selectedDate, optime, bay }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
      case "1001":
        showToast({
          message:
            error?.response?.data?.error?.message ??
            "예약이 있는 베이는 삭제할 수 없습니다.",
          tone: "error",
        });
        break;
      case "1002":
        showToast({
          message: "잘못된 값이 입력되었습니다. 다시 시도해주세요.",
          tone: "error",
        });
        break;
      case "1301":
        showToast({ message: "베이를 찾을 수 없습니다.", tone: "error" });
        break;
      case "1102":
        showToast({ message: "접근 권한이 없습니다.", tone: "error" });
        navigate("/");
        break;
      default:
        showToast({
          message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.",
          tone: "error",
        });
        break;
    }
  };

  const mutation = useMutation({
    queryKey: ["setBayStatus"],
    mutationFn: (data) => setBayStatus(data),
    onSuccess: () => {
      dispatch(getCarwashItemThunk({ carwashId, selectedDate }));
      showToast({ message: "베이 상태가 변경되었습니다." });
    },
    onError: errorHandler,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBay(bay.bayId),
    onSuccess: () => {
      dispatch(getCarwashItemThunk({ carwashId, selectedDate }));
      showToast({ message: `베이 ${bay.bayNo}가 삭제되었습니다.` });
      setIsDeleteOpen(false);
    },
    onError: errorHandler,
  });

  return (
    <Link
      to={`/manage/item/${carwashId}/${bay.bayId}`}
      className={`grid h-40 gap-4 p-4 shadow-xl rounded-xl ${
        !bay.status && "bg-gray-400"
      }`}
    >
      <div className="items-center flex-between">
        <div className="flex-items-center-4">
          <div className="text-xl font-semibold">베이 {bay.bayNo}</div>
          {bay.status === 0 && (
            <WarningMessage>
              베이가 활성화 될 때까지 예약을 받을 수 없습니다.
            </WarningMessage>
          )}
        </div>
        <div className="flex-items-center-2">
          <Toggle bay_id={bay.bayId} status={bay.status} mutation={mutation} />
          <button
            type="button"
            aria-label={`베이 ${bay.bayNo} 삭제`}
            className="px-2 py-1 text-xs text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsDeleteOpen(true);
            }}
            disabled={deleteMutation.isPending}
          >
            삭제
          </button>
        </div>
      </div>

      <TimeTable optime={optime} bookedTime={bay.bayBookedTimeList} />
      <ConfirmModal
        isOpen={isDeleteOpen}
        title="베이 삭제"
        message={`베이 ${bay.bayNo}를 삭제하시겠습니까?\n삭제한 베이는 복구할 수 없습니다.`}
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        danger
        isPending={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </Link>
  );
};

export default CarwashBayItem;
