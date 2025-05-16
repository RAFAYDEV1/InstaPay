import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type OnboardingLayoutProps = {
  image: ImageSourcePropType;
  title: string;
  index: number;
  total: number;
  onNext: () => void;
};

export default function OnboardingLayout({ image, title, index, total, onNext }: OnboardingLayoutProps) {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>

      <View style={styles.pagination}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
        ))}
      </View>

      <View style={styles.buttons}>
        <Text style={[styles.textButton, { color: '#ccc' }]}>Skip</Text>
        <TouchableOpacity onPress={onNext}>
          <Text style={styles.textButton}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'space-around', padding: 20,
  },
  image: {
    height: 250, width: 250, marginTop: 60,
  },
  title: {
    fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#001F5B',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  dot: {
    height: 8, width: 8, borderRadius: 4, backgroundColor: '#ccc', margin: 5,
  },
  activeDot: {
    backgroundColor: '#001F5B',
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between', width: '90%',
  },
  textButton: {
    fontSize: 16, fontWeight: 'bold', color: '#001F5B',
  },
});
