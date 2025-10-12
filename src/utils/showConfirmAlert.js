import { Alert } from "react-native";

/**
 * Hiển thị hộp thoại xác nhận
 * @param {string} title - Tiêu đề (ví dụ: "Xác nhận xoá?")
 * @param {string} message - Nội dung (ví dụ: "Bạn có chắc muốn xoá tất cả lịch sử?")
 * @param {function} onConfirm - Hàm gọi khi người dùng bấm "Đồng ý"
 * @param {function} onCancel - (tuỳ chọn) Hàm gọi khi bấm "Huỷ"
 * @param {boolean} cancelable - (tuỳ chọn) mặc định true
 */
export const showConfirmAlert = (title, message, onConfirm, onCancel, cancelable = true) => {
  Alert.alert(
    title,
    message,
    [
      { text: "Huỷ", style: "cancel", onPress: onCancel },
      { text: "Đồng ý", style: "destructive", onPress: onConfirm },
    ],
    { cancelable: cancelable }
  );
};
