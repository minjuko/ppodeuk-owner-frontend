import { useEffect, useId, useState } from "react";
import ConfirmModal from "../feedback/ConfirmModal";

const Toggle = ({ bay_id, status, mutation }) => {
  // status가 1이면 true, 이외 값은 false
  const [checked, setChecked] = useState(status === 1);
  const id = useId();
  const [nextStatus, setNextStatus] = useState(null);

  useEffect(() => {
    setChecked(status === 1);
  }, [status]);

  const handleChecked = (e) => {
    setNextStatus(e.target.checked ? 1 : 0);
  };

  const confirmChange = () => {
    setChecked(nextStatus === 1);
    mutation.mutate(
      { bay_id, status: nextStatus },
      {
        onSuccess: () => setNextStatus(null),
        onError: () => {
          setChecked(status === 1);
          setNextStatus(null);
        },
      },
    );
  };

  return (
    <form
      className="flex-items-center-2"
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor={id} className="font-semibold text-gray-500 select-none">
        베이 활성화
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={handleChecked}
        onClick={(e) => e.stopPropagation()}
        className="box-content relative w-12 h-6 bg-gray-500 border-2 border-gray-500 rounded-full appearance-none before:transition before:absolute before:w-6 before:h-6 before:bg-white before:rounded-full checked:bg-primary checked:border-2 checked:border-primary checked:before:right-0"
      />
      <ConfirmModal
        isOpen={nextStatus !== null}
        title={nextStatus === 1 ? "베이 활성화" : "베이 비활성화"}
        message={
          nextStatus === 1
            ? "이 베이를 활성화하시겠습니까?"
            : "이 베이를 비활성화하시겠습니까?\n비활성화 중에는 사용자 앱에 표시되지 않습니다."
        }
        confirmLabel={nextStatus === 1 ? "활성화" : "비활성화"}
        isPending={mutation.isPending}
        onClose={() => setNextStatus(null)}
        onConfirm={confirmChange}
      />
    </form>
  );
};

export default Toggle;
