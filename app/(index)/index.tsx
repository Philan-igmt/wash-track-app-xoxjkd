
import React from "react";
import { Stack, router } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { IconCircle } from "@/components/IconCircle";
import { IconSymbol } from "@/components/IconSymbol";
import { Button } from "@/components/button";
import { colors, commonStyles } from "@/styles/commonStyles";

export default function HomeScreen() {
  const services = [
    {
      id: 1,
      title: "Request Car Wash",
      description: "Book a professional car wash service",
      icon: "🚗",
      route: "/request-car-wash",
      color: "#007AFF",
    },
    {
      id: 2,
      title: "Track Driver",
      description: "See your driver's real-time location",
      icon: "📍",
      route: "/track-driver",
      color: "#34C759",
    },
    {
      id: 3,
      title: "Order History",
      description: "View your past car wash orders",
      icon: "📋",
      route: "/order-history",
      color: "#FF9500",
    }
  ];

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => console.log("Settings pressed")}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color="#007AFF" />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "CarWash Pro",
          headerRight: renderHeaderRight,
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
        <View style={styles.heroSection}>
          <IconCircle
            emoji="🚗"
            backgroundColor="#007AFF"
            size={80}
            style={styles.heroIcon}
          />
          <Text style={styles.heroTitle}>Professional Car Wash</Text>
          <Text style={styles.heroSubtitle}>
            Book premium car wash services and track your driver in real-time
          </Text>
        </View>

        <View style={styles.servicesSection}>
          {services.map((service) => (
            <Pressable
              key={service.id}
              style={[styles.serviceCard, { borderLeftColor: service.color }]}
              onPress={() => {
                console.log(`Navigating to ${service.route}`);
                router.push(service.route as any);
              }}
            >
              <View style={styles.serviceIconContainer}>
                <IconCircle
                  emoji={service.icon}
                  backgroundColor={service.color}
                  size={50}
                />
              </View>
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
              </View>
              <IconSymbol name="chevron.right" color="#999" size={20} />
            </Pressable>
          ))}
        </View>

        <View style={styles.quickStatsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Total Washes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>$0</Text>
              <Text style={styles.statLabel}>Total Saved</Text>
            </View>
          </View>
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
  headerButtonContainer: {
    padding: 8,
  },
  heroSection: {
    backgroundColor: 'white',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIcon: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIconContainer: {
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  quickStatsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
