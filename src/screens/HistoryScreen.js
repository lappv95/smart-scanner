import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Linking from "expo-linking";
import {
  Box,
  Button,
  FlatList,
  HStack,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
  useColorMode,
  useTheme,
} from "native-base";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { showConfirmAlert } from "../utils/showConfirmAlert";

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const { colorMode } = useColorMode();
  const { colors } = useTheme();

  useEffect(() => {
    loadHistory();
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );
  const loadHistory = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("scanHistory")) || [];
    setHistory(data); // Hiển thị mục mới nhất lên đầu
  };

  const clearHistory = async () => {
    showConfirmAlert(
      "Xoá tất cả lịch sử?",
      "Hành động này không thể hoàn tác.",
      async () => {
        await AsyncStorage.removeItem("scanHistory");
        setHistory([]);
      }
    )

  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        if (item.data.startsWith("http")) Linking.openURL(item.data);
      }}
    >
      {({ isPressed }) => (
        <Box
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRadius="2xl"
          p="4"
          mb="3"
          shadow="3"
          style={{
            transform: [{ scale: isPressed ? 0.98 : 1 }],
          }}
        >
          <Text
            bold
            fontSize="md"
            color={colorMode === "dark" ? "gray.100" : "gray.800"}
            numberOfLines={1}
          >
            {item.data}
          </Text>
          <Text fontSize="xs" color="gray.400" mt="1">
            {new Date(item.time).toLocaleString()}
          </Text>
        </Box>
      )}
    </Pressable>
  );

  return (
    <Box
      flex={1}
      bg={colorMode === "dark" ? colors.gray[900] : colors.gray[100]}
      safeArea
      px="4"
    >
      <StatusBar
        barStyle={colorMode === "dark" ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <HStack justifyContent="space-between" alignItems="center" mb="4" mt="2">
        <Heading color={"primary.500"} size="md">
          Lịch sử quét
        </Heading>
        {history.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="danger"
            leftIcon={<Icon as={MaterialIcons} name="delete-outline" size="sm" />}
            onPress={clearHistory}
          >
            Xóa tất cả
          </Button>
        )}
      </HStack>

      {/* Danh sách lịch sử */}
      {history.length === 0 ? (
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Icon
            as={MaterialIcons}
            name="history"
            size="xl"
            color="gray.400"
            mb="3"
          />
          <Text color="gray.400" fontSize="md">
            Chưa có lịch sử quét nào
          </Text>
        </VStack>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
}
