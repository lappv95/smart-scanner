import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import { Box, Button, Center, Text } from "native-base";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.7;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!permission) {
    return (
      <Center flex={1}>
        <Text>Đang kiểm tra quyền camera...</Text>
      </Center>
    );
  }

  if (!permission.granted) {
    return (
      <Center flex={1}>
        <Text mb={4}>Ứng dụng cần quyền truy cập camera để quét mã QR</Text>
        <Button onPress={requestPermission}>Cấp quyền</Button>
      </Center>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    setScannedData(data);
    // 🔹 Lưu lịch sử vào AsyncStorage
    const oldHistory = JSON.parse(await AsyncStorage.getItem("scanHistory")) || [];
    const newItem = { id: Date.now(), data, time: new Date().toISOString() };
    await AsyncStorage.setItem("scanHistory", JSON.stringify([newItem, ...oldHistory]));

    if (data.startsWith("http")) {
      Alert.alert(
        "Mở liên kết?",
        data,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Mở",
            style: "default",
            onPress: () => Linking.openURL(data),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_SIZE - 4],
  });

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Overlay tối vùng ngoài */}
      <View style={styles.overlayContainer}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanBox}>
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      {/* Hướng dẫn & kết quả */}
      <Center position="absolute" bottom={100} alignSelf="center" w="80%">
        {scannedData ? (
          <Box bg="white" p={4} borderRadius="lg" shadow={2}>
            <Text bold mb={2}>
              Kết quả:
            </Text>
            <Text mb={3}>{scannedData}</Text>
            <Button onPress={() => setScannedData(null)}>Quét lại</Button>
          </Box>
        ) : (
          <Text color="white" fontSize="md">
            Đưa mã QR vào giữa khung để quét
          </Text>
        )}
      </Center>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    flexDirection: "column",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  middleRow: {
    flexDirection: "row",
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanBox: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderColor: "#00FFAA",
    borderWidth: 3,
    borderRadius: 16,
    overflow: "hidden",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#00FFAA",
    position: "absolute",
    top: 0,
  },
});
