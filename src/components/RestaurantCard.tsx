import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface RestaurantCardProps {
  id: string;
  name: string;
  rating: number;
  userRatingsTotal: number;
  image: string;
  isClosed: boolean;
  isLiked: boolean;
  onLike: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  rating,
  userRatingsTotal,
  image,
  isClosed,
  isLiked,
  onLike,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>
          {rating} ⭐ ({userRatingsTotal} reviews)
        </Text>
        {isClosed && <Text style={styles.closed}>Closed</Text>}
        <TouchableOpacity
          style={[styles.likeButton, isLiked && styles.liked]}
          onPress={() => onLike(id)}
        >
          <Text style={styles.likeText}>{isLiked ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  closed: {
    color: 'red',
    fontWeight: 'bold',
  },
  likeButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    alignItems: 'center',
  },
  liked: {
    backgroundColor: '#FF6347',
  },
  likeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestaurantCard;