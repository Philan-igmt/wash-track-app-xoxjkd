
import React, { useState } from "react";
import { Stack, router } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable, TextInput, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { IconCircle } from "@/components/IconCircle";
import { Button } from "@/components/button";

interface CarWashService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  icon: string;
}

export default function RequestCarWashScreen() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const services: CarWashService[] = [
    {
      id: "basic",
      name: "Basic Wash",
      price: 25,
      duration: "30 min",
      description: "Exterior wash and dry",
      icon: "🚿",
    },
    {
      id: "premium",
      name: "Premium Wash",
      price: 45,
      duration: "45 min",
      description: "Exterior + interior cleaning",
      icon: "✨",
    },
    {
      id: "deluxe",
      name: "Deluxe Detail",
      price: 75,
      duration: "60 min",
      description: "Full detail with wax and polish",
      icon: "💎",
    },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleBookService = () => {
    if (!selectedService || !location || !phoneNumber || !selectedTime) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    const selectedServiceData = services.find(s => s.id === selectedService);
    console.log("Booking service:", {
      service: selectedServiceData,
      location,
      phoneNumber,
      time: selectedTime,
      notes
    });

    Alert.alert(
      "Booking Confirmed!",
      `Your ${selectedServiceData?.name} has been booked for ${selectedTime}. A driver will be assigned shortly.`,
      [
        {
          text: "Track Driver",
          onPress: () => router.push("/track-driver"),
        },
        {
          text: "OK",
          style: "default",
        },
      ]
    );
  };

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.back()}
      style={styles.headerButton}
    >
      <IconSymbol name="chevron.left" color="#007AFF" size={24} />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Request Car Wash",
          headerLeft: renderHeaderLeft,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            color: '#333333',
            fontWeight: '600',
          },
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          {services.map((service) => (
            <Pressable
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.selectedServiceCard
              ]}
              onPress={() => {
                console.log("Selected service:", service.id);
                setSelectedService(service.id);
              }}
            >
              <View style={styles.serviceHeader}>
                <IconCircle
                  emoji={service.icon}
                  backgroundColor={selectedService === service.id ? "#007AFF" : "#f0f0f0"}
                  size={40}
                />
                <View style={styles.serviceInfo}>
                  <Text style={[
                    styles.serviceName,
                    selectedService === service.id && styles.selectedText
                  ]}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <View style={styles.servicePricing}>
                  <Text style={[
                    styles.servicePrice,
                    selectedService === service.id && styles.selectedText
                  ]}>
                    ${service.price}
                  </Text>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.inputContainer}>
            <IconSymbol name="location" color="#666" size={20} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your address"
              value={location}
              onChangeText={setLocation}
              multiline
            />
          </View>
          <Pressable style={styles.useCurrentLocationButton}>
            <IconSymbol name="location.fill" color="#007AFF" size={16} />
            <Text style={styles.useCurrentLocationText}>Use Current Location</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.inputContainer}>
            <IconSymbol name="phone" color="#666" size={20} />
            <TextInput
              style={styles.textInput}
              placeholder="Phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time</Text>
          <View style={styles.timeSlotContainer}>
            {timeSlots.map((time) => (
              <Pressable
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => {
                  console.log("Selected time:", time);
                  setSelectedTime(time);
                }}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <View style={styles.inputContainer}>
            <IconSymbol name="note.text" color="#666" size={20} />
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Special instructions or requests"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.bookingSection}>
          <Button
            onPress={handleBookService}
            style={styles.bookButton}
            disabled={!selectedService || !location || !phoneNumber || !selectedTime}
          >
            Book Car Wash Service
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  headerButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedServiceCard: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  servicePricing: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedText: {
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 20,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  useCurrentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  useCurrentLocationText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  bookingSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
  },
});
