import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
  useColorMode,
  useTheme,
  VStack,
} from "native-base";
import { useState } from "react";
import { Alert } from "react-native";

export default function SettingsScreen() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { colors } = useTheme();
  const [isDark, setIsDark] = useState(colorMode === "dark");

  const handleClearHistory = async () => {
    Alert.alert(
      "Xóa lịch sử",
      "Bạn có chắc muốn xóa toàn bộ lịch sử quét không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("scanHistory");
            Alert.alert("Đã xóa thành công!");
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, label, onPress, right }) => (
    <Pressable onPress={onPress}>
      <HStack
        alignItems="center"
        justifyContent="space-between"
        px="4"
        py="3"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderRadius="xl"
        mb="2"
        shadow="1"
      >
        <HStack alignItems="center" space="3">
          <Icon as={Ionicons} name={icon} size="sm" color="primary.500" />
          <Text fontSize="md" color={colorMode === "dark" ? "gray.100" : "gray.800"}>
            {label}
          </Text>
        </HStack>
        {right}
      </HStack>
    </Pressable>
  );

  return (
    <Box flex={1} bg={colorMode === "dark" ? "gray.900" : "gray.100"} pt="6" px="4">
      <Text fontSize="xl" fontWeight="bold" mb="4" color="primary.500">
        Cài đặt
      </Text>

      <VStack space="2">
        <SettingItem
          icon="moon-outline"
          label="Chế độ tối"
          right={
            <Switch
              isChecked={isDark}
              onToggle={() => {
                toggleColorMode();
                setIsDark(!isDark);
              }}
            />
          }
        />

        <SettingItem
          icon="trash-outline"
          label="Xóa lịch sử quét"
          onPress={handleClearHistory}
        />

        <Divider my="2" />

        <SettingItem
          icon="star-outline"
          label="Nâng cấp gói Pro"
          onPress={() => Alert.alert("Thông báo", "Tính năng đang phát triển 😄")}
        />

        <SettingItem
          icon="mail-outline"
          label="Liên hệ hỗ trợ"
          onPress={() => Alert.alert("Liên hệ", "Email: lappv.it@gmail.com")}
        />
      </VStack>

      <Center mt="auto" mb="6">
        <Text fontSize="xs" color="gray.500">
          Smart QR Scanner v1.0.0  
        </Text>
        <Text fontSize="xs" color="gray.400">
          © 2025 Phạm Văn Lập
        </Text>
      </Center>
    </Box>
  );
}
