import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Place } from '../types';

interface PlaceDetailsProps {
  place: Place;
  onClose: () => void;
}

const PlaceDetails = ({ place, onClose }: PlaceDetailsProps) => {
  const openWebsite = async () => {
    if (place.website) {
      const canOpen = await Linking.canOpenURL(place.website);
      if (canOpen) {
        await Linking.openURL(place.website);
      }
    }
  };

  const openPhone = async () => {
    if (place.phoneNumber) {
      const phoneUrl = `tel:${place.phoneNumber.replace(/\s/g, '')}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    }
  };

  const openDirections = async () => {
    const { latitude, longitude } = place.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${place.name}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${place.name})`,
    });

    if (url) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    }
  };

  // Helper to render stars based on rating
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`star-${i}`} name="star" size={16} color="#FFC107" />
      );
    }

    // Add half star if needed
    if (halfStar) {
      stars.push(
        <Ionicons key="half-star" name="star-half" size={16} color="#FFC107" />
      );
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFC107" />
      );
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.address}</Text>

        {place.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {renderRatingStars(place.rating)}
            </View>
            <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
          </View>
        )}

        {place.openingHours?.isOpen !== undefined && (
          <View style={styles.openStatusContainer}>
            <Text style={[
              styles.openStatus,
              place.openingHours.isOpen ? styles.openNow : styles.closedNow
            ]}>
              {place.openingHours.isOpen ? 'Open Now' : 'Closed Now'}
            </Text>
          </View>
        )}

        {place.openingHours?.weekdayText && (
          <View style={styles.hoursContainer}>
            <Text style={styles.sectionTitle}>Hours</Text>
            {place.openingHours.weekdayText.map((day, index) => (
              <Text key={index} style={styles.hoursText}>{day}</Text>
            ))}
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          {place.phoneNumber && (
            <TouchableOpacity style={styles.actionButton} onPress={openPhone}>
              <Ionicons name="call" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}

          {place.website && (
            <TouchableOpacity style={styles.actionButton} onPress={openWebsite}>
              <Ionicons name="globe" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={openDirections}>
            <Ionicons name="navigate" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>

        {place.photos && place.photos.length > 0 && (
          <View style={styles.photosContainer}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroll}
            >
              {place.photos.map((photoUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: photoUrl }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  content: {
    marginTop: 5,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#666',
  },
  openStatusContainer: {
    marginBottom: 10,
  },
  openStatus: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  openNow: {
    color: '#4CAF50',
  },
  closedNow: {
    color: '#F44336',
  },
  hoursContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionButtonText: {
    marginTop: 5,
    color: '#007AFF',
  },
  photosContainer: {
    marginTop: 10,
  },
  photoScroll: {
    marginTop: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
});

export default PlaceDetails;
