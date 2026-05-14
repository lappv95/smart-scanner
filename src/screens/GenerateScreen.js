import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

import {
    Box,
    Button,
    Center,
    ScrollView,
    Text,
    VStack,
    useColorModeValue,
} from "native-base";

import { useRef, useState } from "react";
import { Alert, TextInput } from "react-native";

export default function GenerateScreen() {
  const [inputText, setInputText] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = useRef();

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const inputBgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const placeholderTextColor = useColorModeValue(
    "gray.500",
    "gray.400"
  );

  // Generate QR
  const generateQRCode = async () => {
    if (!inputText.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung để sinh mã QR");
      return;
    }

    try {
      setIsLoading(true);

      // fake loading nhẹ cho mượt UI
      setTimeout(() => {
        setShowQR(true);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Lỗi", error.message);
    }
  };

  // Copy text
  const handleCopyToClipboard = async () => {
    if (!inputText.trim()) {
      Alert.alert("Lỗi", "Không có nội dung để sao chép");
      return;
    }

    await Clipboard.setStringAsync(inputText);

    Alert.alert(
      "Thành công",
      "Nội dung đã được sao chép"
    );
  };

  // Share text
  const handleShareQRCode = async () => {
    if (!inputText.trim()) {
      Alert.alert("Lỗi", "Không có dữ liệu để chia sẻ");
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate QR code as SVG and convert to PNG
      if (qrRef.current && typeof qrRef.current.toDataURL === 'function') {
        qrRef.current.toDataURL(async (dataURL) => {
          let fileUri;
          try {
            // Save QR image to file
            const fileName = `QR_${Date.now()}.png`;
            fileUri = `${FileSystem.documentDirectory}${fileName}`;

            // dataURL may be a full data URL (data:image/png;base64,...) or raw base64 string
            const base64 = typeof dataURL === 'string' && dataURL.includes(',') ? dataURL.split(',')[1] : dataURL;
            if (!base64) throw new Error('Không nhận được dữ liệu ảnh từ QR component');

            await FileSystem.writeAsStringAsync(
              fileUri,
              base64,
              { encoding: FileSystem.EncodingType.Base64 }
            );

            // Verify file exists
            const info = await FileSystem.getInfoAsync(fileUri);
            if (!info.exists) throw new Error('Tệp ảnh QR không được tạo');

            // Share the file
            await Sharing.shareAsync(info.uri, {
              mimeType: 'image/png',
              dialogTitle: 'Chia sẻ mã QR',
            });
          } catch (error) {
            Alert.alert('Lỗi', `Không thể chia sẻ: ${error.message}`);
          } finally {
            // cleanup: remove the temporary file if it exists
            try {
              if (fileUri) await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (_) {}
            setIsLoading(false);
          }
        });
      } else {
        setIsLoading(false);
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu ảnh từ QR component.');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Lỗi",
        `Không thể chia sẻ: ${error.message}`
      );
    }
  };

  return (
    <ScrollView
      flex={1}
      bg={bgColor}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Box flex={1} px="4" py="6">
        {/* Header */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb="2"
          color="primary.500"
        >
          Sinh mã QR
        </Text>

        <Text
          fontSize="sm"
          color={placeholderTextColor}
          mb="6"
        >
          Nhập nội dung để tạo mã QR
        </Text>

        {/* Input */}
        <Box
          bg={cardBgColor}
          rounded="xl"
          p="4"
          mb="6"
          shadow="1"
        >
          <Text
            fontSize="sm"
            fontWeight="600"
            mb="2"
            color={textColor}
          >
            Nội dung
          </Text>

          <TextInput
            placeholder="Nhập text, URL, Wi-Fi, email..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor={
              placeholderTextColor === "gray.500"
                ? "#6b7280"
                : "#9ca3af"
            }
            multiline
            numberOfLines={4}
            style={{
              backgroundColor:
                inputBgColor === "gray.50"
                  ? "#f9fafb"
                  : "#374151",

              borderColor: "#007AFF",
              borderWidth: 1,
              borderRadius: 12,

              paddingHorizontal: 12,
              paddingVertical: 12,

              fontSize: 16,

              color:
                textColor === "gray.800"
                  ? "#111827"
                  : "#f3f4f6",
            }}
          />
        </Box>

        {/* Generate Button */}
        <Button
          onPress={generateQRCode}
          isLoading={isLoading}
          mb="6"
          bg="primary.500"
          _pressed={{ bg: "primary.600" }}
          rounded="lg"
          py="3"
        >
          <Text color="white" fontWeight="bold">
            Sinh mã QR
          </Text>
        </Button>

        {/* QR Display */}
        {showQR && (
          <Box
            bg={cardBgColor}
            rounded="xl"
            p="4"
            mb="6"
            shadow="2"
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              mb="3"
              color={textColor}
            >
              Mã QR của bạn
            </Text>

            <Center
              mb="4"
              bg="white"
              p="4"
              rounded="xl"
            >
              <QRCode
                getRef={qrRef}
                value={inputText || " "}
                size={250}
                color="black"
                backgroundColor="white"
              />
            </Center>

            {/* Actions */}
            <VStack space="2">
              <Button
                onPress={handleCopyToClipboard}
                variant="outline"
                borderColor="primary.500"
                rounded="lg"
                leftIcon={
                  <Ionicons
                    name="copy-outline"
                    size={18}
                    color="#007AFF"
                  />
                }
              >
                <Text
                  color="primary.500"
                  fontWeight="600"
                >
                  Sao chép nội dung
                </Text>
              </Button>

              <Button
                onPress={handleShareQRCode}
                variant="outline"
                borderColor="primary.500"
                rounded="lg"
                isLoading={isLoading}
                leftIcon={
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="#007AFF"
                  />
                }
              >
                <Text
                  color="primary.500"
                  fontWeight="600"
                >
                  Chia sẻ ảnh QR
                </Text>
              </Button>
            </VStack>
          </Box>
        )}

        {/* Info */}
        {!showQR && (
          <Box
            bg={cardBgColor}
            rounded="xl"
            p="4"
            shadow="1"
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              mb="2"
              color={textColor}
            >
              Hỗ trợ các định dạng:
            </Text>

            <VStack space="1">
              <Text
                fontSize="xs"
                color={placeholderTextColor}
              >
                • Text bất kỳ
              </Text>

              <Text
                fontSize="xs"
                color={placeholderTextColor}
              >
                • URL
              </Text>

              <Text
                fontSize="xs"
                color={placeholderTextColor}
              >
                • Wi-Fi
              </Text>

              <Text
                fontSize="xs"
                color={placeholderTextColor}
              >
                • Email
              </Text>

              <Text
                fontSize="xs"
                color={placeholderTextColor}
              >
                • Số điện thoại
              </Text>
            </VStack>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}