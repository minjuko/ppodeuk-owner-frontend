import RegisterForm from "../organisms/RegisterForm";
import Box from "../atoms/Box";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  deleteImage,
  getCarwashesDetails,
  putCarwashesDetails,
} from "../../apis/carwashes";
import MobilePreview from "../organisms/MobilePreview";
import useRegisterForm from "../../hooks/useRegisterForm";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../feedback/ToastProvider";
import ConfirmModal from "../feedback/ConfirmModal";
import { useState } from "react";

const CarwashDetailEditingTemplate = () => {
  const navigate = useNavigate();
  const { carwash_id } = useParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [imageToDelete, setImageToDelete] = useState(null);

  const { data } = useSuspenseQuery({
    queryKey: ["getCarwashDetail", carwash_id],
    queryFn: () => getCarwashesDetails(carwash_id),
  });

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
          message: "수정하지 못했습니다. 잠시 후 다시 시도해 주세요.",
          tone: "error",
        });
        break;
    }
  };

  const mutation = useMutation({
    mutationFn: async (inputs) => {
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
        formData.append("imageFileList", file);
      });
      formData.append("updateData", blob);

      return putCarwashesDetails(carwash_id, formData);
    },
    onSuccess: () => {
      showToast({ message: "세차장 정보가 수정되었습니다." });
      queryClient.invalidateQueries({
        queryKey: ["getCarwashDetail", carwash_id],
      });
      queryClient.invalidateQueries({ queryKey: ["carwash"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      navigate(`/manage/item/${carwash_id}`);
    },
    onError: errorHandler,
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => deleteImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getCarwashDetail", carwash_id],
      });
      setImageToDelete(null);
      showToast({ message: "사진이 삭제되었습니다." });
    },
    onError: errorHandler,
  });

  const carwashDetail = data?.data?.response;

  const initialValue = {
    carwashName: carwashDetail.name,
    carwashAddress: carwashDetail.locationDTO.address,
    latitude: carwashDetail.locationDTO.latitude,
    longitude: carwashDetail.locationDTO.longitude,
    carwashTel: carwashDetail.tel,
    pricePer30min: carwashDetail.price,
    weekdayOpenTime: carwashDetail.optime.weekday.start,
    weekdayCloseTime: carwashDetail.optime.weekday.end,
    weekendOpenTime: carwashDetail.optime.weekend.start,
    weekendCloseTime: carwashDetail.optime.weekend.end,
    keypoint: carwashDetail.keywordIdList,
    carwashImage: [],
    carwashDescription: carwashDetail.description,
  };

  const { inputs, handleChange, isDirty } = useRegisterForm(initialValue);

  return (
    <div className="flex-8">
      <Box className="relative grid-8 p-14">
        <button
          type="button"
          aria-label="세차장 정보 수정 닫기"
          onClick={() => navigate(`/manage/item/${carwash_id}`)}
          className="absolute text-3xl leading-none text-gray-400 transition-colors right-6 top-6 hover:text-gray-700"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold">세차장 정보 수정</h1>
        <RegisterForm
          inputs={inputs}
          onChange={handleChange}
          mutation={mutation}
          isDirty={isDirty}
          buttonLabel="수정하기"
          requireImage={false}
          existingImages={carwashDetail.imageFileList}
          onDeleteExisting={setImageToDelete}
        />
      </Box>
      <MobilePreview
        inputs={inputs}
        existingImages={carwashDetail.imageFileList}
      />
      <ConfirmModal
        isOpen={Boolean(imageToDelete)}
        title="사진 삭제"
        message="이 사진을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        danger
        isPending={deleteImageMutation.isPending}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => deleteImageMutation.mutate(imageToDelete.id)}
      />
    </div>
  );
};

export default CarwashDetailEditingTemplate;
