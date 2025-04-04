import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, Modal, Button } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  icon_url: string;
}

const API_URL = "https://api.dinver.eu/api/app/restaurants/sample";

const RestaurantList: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState<Set<string>>(new Set());
  const [address, setAddress] = useState("Enter address");
  const [isModalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    fetchRestaurants(1, search);
  }, [search]);

  const fetchRestaurants = async (pageNumber: number, query: string) => {
    if (loading || pageNumber > totalPages) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?page=${pageNumber}&search=${query}`);
      const data = await response.json();
      setRestaurants((prev) => (pageNumber === 1 ? data.restaurants : [...prev, ...data.restaurants]));
      setTotalPages(data.totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
    setLoading(false);
  };

  const handleLike = (id: string) => {
    setLikedRestaurants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddressChange = () => {
    setModalVisible(true);
  };

  const saveAddress = () => {
    if (newAddress.trim()) {
      setAddress(newAddress);
      setModalVisible(false);
      setNewAddress("");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "rgba(50, 50, 50, 0.9)" : "#fff" }]}>
      <View style={[styles.profileContainer, { marginTop: screenHeight * 0.06 }]}>
        <View style={styles.profileRow}>
          {user ? (
            <>
              <Image
                source={require("../../assets/ikona.jpeg")}
                style={styles.profileImage}
              />
              <View style={styles.profileDetails}>
                <Text style={[styles.profileText, { color: isDarkMode ? "#fff" : "#000" }]}>
                  Hello, {user.firstName} {user.lastName}
                </Text>
                <TouchableOpacity onPress={handleAddressChange}>
                  <Text style={[styles.addressText, { color: isDarkMode ? "#eee" : "#555" }]}>{address}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <TouchableOpacity onPress={handleAddressChange} style={styles.addressContainerCentered}>
              <Text style={[styles.addressText, { color: isDarkMode ? "#eee" : "#555" }]}>{address}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <MaterialIcons name="map" size={27} color={isDarkMode ? "#bbb" : "#000"} style={styles.mapIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? "#333" : "#fff" }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? "#fff" : "#000" }]}>Enter new address</Text>
            <TextInput
              style={[styles.modalInput, { borderColor: isDarkMode ? "#555" : "#ccc", color: isDarkMode ? "#fff" : "#000" }]}
              placeholder="New address"
              placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={saveAddress} color={isDarkMode ? "#fff" : "#000"} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color={isDarkMode ? "#fff" : "#000"} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? "#222" : "#f0f0f0" }]}>
        <AntDesign name="search1" size={20} color={isDarkMode ? "#aaa" : "#555"} style={styles.searchIcon} />
        <TextInput
          placeholder="Find your restaurant"
          placeholderTextColor={isDarkMode ? "#aaa" : "#555"}
          style={[styles.searchBar, { color: isDarkMode ? "#fff" : "#000" }]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        onEndReached={() => fetchRestaurants(page + 1, search)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <Text style={[styles.noResultsText, { color: isDarkMode ? '#fff' : '#000' }]}>
              No results found.
            </Text>
          ) : null
        }
        ListFooterComponent={loading ? <ActivityIndicator color={isDarkMode ? "#fff" : "#000"} /> : null}
        renderItem={({ item, index }) => {
          const isClosed = index % 5 === 0;
          const openingTime = "08AM";
          const distance = "2.5 km";

          return (
            <View style={[styles.card, { backgroundColor: isDarkMode ? "#222" : "#f9f9f9" }]}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.icon_url }} style={[styles.image, isClosed && styles.closedImage]} />
                {isClosed && (
                  <View style={styles.overlay}>
                    <Text style={[styles.overlayText, { color: "#ff6666" }]}>
                      Restaurant opens at {openingTime}
                    </Text>
                  </View>
                )}
                <View style={styles.ratingContainer}>
                  <View style={styles.ratingBackground}>
                    <Text style={[styles.ratingText, { color: "#fff" }]}>
                      {item.rating} ⭐ ({item.user_ratings_total})
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.name, { color: isDarkMode ? "#fff" : "#000" }]}>{item.name}</Text>
                <Text style={[styles.distanceText, { color: isDarkMode ? "#bbb" : "#555" }]}>{distance}</Text>
              </View>
              <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item.id)}>
                <AntDesign name={likedRestaurants.has(item.id) ? "heart" : "hearto"} size={24} color={isDarkMode ? "red" : "darkred"} />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileRowCentered: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  profileDetails: {
    flex: 1,
  },
  profileText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressText: {
    fontSize: 16,
    marginBottom: 0,
    
  },
  mapIcon: {
    marginLeft: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  addressContainerCentered: {
    flex: 1,
    alignItems: "center", // Centriranje horizontalno
    justifyContent: "center", // Centriranje vertikalno
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    borderRadius: 15,
    marginVertical: 10,
    overflow: "hidden",
    paddingBottom: 10,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    height: 180,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closedImage: {
    opacity: 0.5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    padding: 10,
    alignItems: "center",
  },
  textContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  rating: {
    fontSize: 14,
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  ratingContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  ratingBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  distanceText: {
    fontSize: 14,
    textAlign: "left",
    marginTop: 5,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default RestaurantList;
