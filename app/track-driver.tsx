
import React, { useState, useEffect } from "react";
import { Stack, router } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable, Animated } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { IconCircle } from "@/components/IconCircle";
import { Button } from "@/components/button";

interface DriverInfo {
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
  eta: string;
  status: 'assigned' | 'on_way' | 'arrived' | 'in_progress' | 'completed';
}

export default function TrackDriverScreen() {
  const [driver, setDriver] = useState<DriverInfo>({
    name: "Mike Johnson",
    phone: "(555) 123-4567",
    vehicle: "Blue Honda Civic",
    plateNumber: "ABC-123",
    rating: 4.8,
    eta: "15 min",
    status: 'on_way'
  });

  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Simulate driver status updates
    const statusUpdates = [
      { status: 'assigned' as const, eta: '20 min' },
      { status: 'on_way' as const, eta: '15 min' },
      { status: 'arrived' as const, eta: '0 min' },
      { status: 'in_progress' as const, eta: '30 min' },
      { status: 'completed' as const, eta: '0 min' }
    ];

    let currentIndex = 1; // Start with 'on_way'
    const interval = setInterval(() => {
      if (currentIndex < statusUpdates.length) {
        setDriver(prev => ({
          ...prev,
          status: statusUpdates[currentIndex].status,
          eta: statusUpdates[currentIndex].eta
        }));
        currentIndex++;
        console.log("Driver status updated to:", statusUpdates[currentIndex - 1].status);
      } else {
        clearInterval(interval);
      }
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Pulse animation for active tracking
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    if (driver.status === 'on_way' || driver.status === 'in_progress') {
      pulse();
    }
  }, [driver.status, pulseAnim]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'assigned':
        return { text: 'Driver Assigned', color: '#FF9500', icon: '👤' };
      case 'on_way':
        return { text: 'Driver On The Way', color: '#007AFF', icon: '🚗' };
      case 'arrived':
        return { text: 'Driver Has Arrived', color: '#34C759', icon: '📍' };
      case 'in_progress':
        return { text: 'Service In Progress', color: '#5856D6', icon: '🧽' };
      case 'completed':
        return { text: 'Service Completed', color: '#34C759', icon: '✅' };
      default:
        return { text: 'Unknown Status', color: '#666', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(driver.status);

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
          title: "Track Driver",
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
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <IconSymbol name="map" color="#666" size={48} />
            <Text style={styles.mapPlaceholderTitle}>Map View Not Available</Text>
            <Text style={styles.mapPlaceholderText}>
              Real-time maps are not supported in Natively web environment.
              In a production app, this would show the driver&apos;s live location using react-native-maps.
            </Text>
          </View>
          
          {/* Driver Location Indicator */}
          <Animated.View 
            style={[
              styles.driverIndicator,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <IconCircle
              emoji="🚗"
              backgroundColor={statusInfo.color}
              size={60}
            />
          </Animated.View>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, { borderLeftColor: statusInfo.color }]}>
          <View style={styles.statusHeader}>
            <IconCircle
              emoji={statusInfo.icon}
              backgroundColor={statusInfo.color}
              size={40}
            />
            <View style={styles.statusInfo}>
              <Text style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </Text>
              {driver.eta !== '0 min' && (
                <Text style={styles.etaText}>ETA: {driver.eta}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Driver Information */}
        <View style={styles.driverCard}>
          <Text style={styles.cardTitle}>Your Driver</Text>
          <View style={styles.driverInfo}>
            <IconCircle
              emoji="👨‍💼"
              backgroundColor="#007AFF"
              size={60}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
              <Text style={styles.driverPlate}>Plate: {driver.plateNumber}</Text>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" color="#FFD700" size={16} />
                <Text style={styles.ratingText}>{driver.rating}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Button
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log("Calling driver:", driver.phone)}
            >
              <IconSymbol name="phone" color="#007AFF" size={16} />
              <Text style={styles.actionButtonText}>Call</Text>
            </Button>
            <Button
              variant="outline"
              style={styles.actionButton}
              onPress={() => console.log("Messaging driver")}
            >
              <IconSymbol name="message" color="#007AFF" size={16} />
              <Text style={styles.actionButtonText}>Message</Text>
            </Button>
          </View>
        </View>

        {/* Service Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Service Progress</Text>
          <View style={styles.progressSteps}>
            {[
              { key: 'assigned', label: 'Assigned', icon: '👤' },
              { key: 'on_way', label: 'On Way', icon: '🚗' },
              { key: 'arrived', label: 'Arrived', icon: '📍' },
              { key: 'in_progress', label: 'In Progress', icon: '🧽' },
              { key: 'completed', label: 'Completed', icon: '✅' },
            ].map((step, index) => {
              const isActive = step.key === driver.status;
              const isCompleted = ['assigned', 'on_way', 'arrived', 'in_progress', 'completed'].indexOf(step.key) <= 
                                 ['assigned', 'on_way', 'arrived', 'in_progress', 'completed'].indexOf(driver.status);
              
              return (
                <View key={step.key} style={styles.progressStep}>
                  <View style={[
                    styles.progressStepIndicator,
                    isCompleted && styles.progressStepCompleted,
                    isActive && styles.progressStepActive
                  ]}>
                    <Text style={styles.progressStepIcon}>{step.icon}</Text>
                  </View>
                  <Text style={[
                    styles.progressStepLabel,
                    isActive && styles.progressStepLabelActive
                  ]}>
                    {step.label}
                  </Text>
                  {index < 4 && (
                    <View style={[
                      styles.progressStepLine,
                      isCompleted && styles.progressStepLineCompleted
                    ]} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {driver.status === 'completed' && (
          <View style={styles.completionCard}>
            <IconCircle
              emoji="🎉"
              backgroundColor="#34C759"
              size={60}
            />
            <Text style={styles.completionTitle}>Service Completed!</Text>
            <Text style={styles.completionText}>
              Your car wash is complete. Thank you for using CarWash Pro!
            </Text>
            <Button
              style={styles.rateButton}
              onPress={() => console.log("Rate service")}
            >
              Rate Your Experience
            </Button>
          </View>
        )}
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
  mapContainer: {
    height: 250,
    backgroundColor: '#e9ecef',
    position: 'relative',
    marginBottom: 20,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  driverIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  etaText: {
    fontSize: 14,
    color: '#666',
  },
  driverCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverDetails: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  driverVehicle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  driverPlate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStepCompleted: {
    backgroundColor: '#34C759',
  },
  progressStepActive: {
    backgroundColor: '#007AFF',
  },
  progressStepIcon: {
    fontSize: 16,
  },
  progressStepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  progressStepLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  progressStepLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#f0f0f0',
    zIndex: -1,
  },
  progressStepLineCompleted: {
    backgroundColor: '#34C759',
  },
  completionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  rateButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 32,
  },
});
