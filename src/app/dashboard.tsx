
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "../api";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalTasks: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const response = await api.get("/tasks", {
        params: {
          page,
          limit: 10,
          ...(search.trim() ? { search: search.trim() } : {}),
        },
      });

      setTasks(response.data.data);
      setPagination(response.data.pagination);
    } catch (error: any) {
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync("token");
        router.replace("/");
        return;
      }

      Alert.alert("Error", "Could not load tasks. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const createTask = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Enter a task title");
      return;
    }

    try {
      await api.post("/tasks", { title: title.trim() });
      setTitle("");
      setPage(1);
      await loadTasks();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ?? "Could not create task"
      );
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}`, {
        completed: !task.completed,
      });

      await loadTasks();
    } catch {
      Alert.alert("Error", "Could not update task");
    }
  };

  const deleteTask = (task: Task) => {
    Alert.alert("Delete task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/tasks/${task.id}`);
            await loadTasks();
          } catch {
            Alert.alert("Error", "Could not delete task");
          }
        },
      },
    ]);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>My Tasks</Text>
          <Text style={styles.subtitle}>Manage your daily work</Text>
        </View>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.createRow}>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter a new task"
          value={title}
          onChangeText={setTitle}
          maxLength={200}
          onSubmitEditing={createTask}
          returnKeyType="done"
        />

        <Pressable style={styles.addButton} onPress={createTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setPage(1);
        }}
        autoCapitalize="none"
      />

      {loading && <ActivityIndicator style={styles.loader} />}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No tasks found.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Pressable
              style={styles.taskInfo}
              onPress={() => toggleTask(item)}
            >
              <Text style={styles.checkbox}>
                {item.completed ? "☑" : "☐"}
              </Text>

              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTitle,
                ]}
              >
                {item.title}
              </Text>
            </Pressable>

            <Pressable onPress={() => deleteTask(item)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={styles.pagination}>
        <Pressable
          disabled={!pagination?.hasPreviousPage}
          style={[
            styles.pageButton,
            !pagination?.hasPreviousPage && styles.disabledButton,
          ]}
          onPress={() => setPage((current) => current - 1)}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </Pressable>

        <Text style={styles.pageInfo}>
          {pagination
            ? `${pagination.page} / ${Math.max(1, pagination.totalPages)}`
            : `${page}`}
        </Text>

        <Pressable
          disabled={!pagination?.hasNextPage}
          style={[
            styles.pageButton,
            !pagination?.hasNextPage && styles.disabledButton,
          ]}
          onPress={() => setPage((current) => current + 1)}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
    paddingTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101828",
  },
  subtitle: {
    color: "#667085",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  createRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  titleInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    padding: 12,
  },
  addButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  loader: {
    marginVertical: 10,
  },
  list: {
    paddingBottom: 12,
    flexGrow: 1,
  },
  empty: {
    textAlign: "center",
    color: "#667085",
    marginTop: 40,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  checkbox: {
    fontSize: 23,
    marginRight: 10,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
    color: "#101828",
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#98a2b3",
  },
  deleteText: {
    color: "#dc2626",
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  pageButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#98a2b3",
  },
  pageButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  pageInfo: {
    fontWeight: "600",
    color: "#344054",
  },
});
