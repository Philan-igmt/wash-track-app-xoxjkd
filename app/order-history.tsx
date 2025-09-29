
import React, { useState } from "react";
import { Stack, router } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable, FlatList } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { IconCircle } from "@/components/IconCircle";
import { Button } from "@/components/button";

interface Order {
  id: string;
  date: string;
  service: string;
  price: number;
  status: 'completed' | 'cancelled' | 'in_progress';
  driver: string;
  location: string;
  rating?: number;
}

export default function OrderHistoryScreen() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-01-15",
      service: "Premium Wash",
      price: 45,
      status: 'completed',
      driver: "Mike Johnson",
      location: "123 Main St, Downtown",
      rating: 5,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      service: "Basic Wash",
      price: 25,
      status: 'completed',
      driver: "Sarah Wilson",
      location: "456 Oak Ave, Midtown",
      rating: 4,
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      service: "Deluxe Detail",
      price: 75,
      status: 'completed',
      driver: "David Chen",
      location: "789 Pine St, Uptown",
      rating: 5,
    },
    {
      id: "ORD-004",
      date: "2023-12-28",
      service: "Premium Wash",
      price: 45,
      status: 'cancelled',
      driver: "Lisa Brown",
      location: "321 Elm St, Westside",
    },
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { text: 'Completed', color: '#34C759', icon: '✅' };
      case 'cancelled':
        return { text: 'Cancelled', color: '#FF3B30', icon: '❌' };
      case 'in_progress':
        return { text: 'In Progress', color: '#007AFF', icon: '🔄' };
      default:
        return { text: 'Unknown', color: '#666', icon: '❓' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <IconSymbol
        key={index}
        name={index < rating ? "star.fill" : "star"}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        size={14}
      />
    ));
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.serviceInfo}>
            <IconCircle
              emoji="🚗"
              backgroundColor="#007AFF"
              size={40}
            />
            <View style={styles.serviceDetails}>
              <Text style={styles.serviceName}>{item.service}</Text>
              <Text style={styles.driverName}>Driver: {item.driver}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
            <Text style={styles.price}>${item.price}</Text>
          </View>

          {item.rating && item.status === 'completed' && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Your Rating:</Text>
              <View style={styles.starsContainer}>
                {renderStars(item.rating)}
              </View>
            </View>
          )}
        </View>

        <View style={styles.orderActions}>
          {item.status === 'completed' && (
            <>
              <Button
                variant="outline"
                size="sm"
                style={styles.actionButton}
                onPress={() => console.log("Reorder service:", item.id)}
              >
                Reorder
              </Button>
              <Button
                variant="outline"
                size="sm"
                style={styles.actionButton}
                onPress={() => console.log("View receipt:", item.id)}
              >
                Receipt
              </Button>
            </>
          )}
          {item.status === 'cancelled' && (
            <Button
              variant="outline"
              size="sm"
              style={styles.actionButton}
              onPress={() => console.log("Rebook service:", item.id)}
            >
              Book Again
            </Button>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconCircle
        emoji="📋"
        backgroundColor="#f0f0f0"
        size={80}
      />
      <Text style={styles.emptyStateTitle}>No Orders Yet</Text>
      <Text style={styles.emptyStateText}>
        Your car wash order history will appear here once you book your first service.
      </Text>
      <Button
        style={styles.bookFirstButton}
        onPress={() => router.push("/request-car-wash")}
      >
        Book Your First Wash
      </Button>
    </View>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => router.back()}
      style={styles.headerButton}
    >
      <IconSymbol name="chevron.left" color="#007AFF" size={24} />
    </Pressable>
  );

  const totalSpent = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.price, 0);

  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order History",
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
      <View style={styles.container}>
        {orders.length > 0 && (
          <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{completedOrders}</Text>
                <Text style={styles.summaryLabel}>Completed Orders</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>${totalSpent}</Text>
                <Text style={styles.summaryLabel}>Total Spent</Text>
              </View>
            </View>
          </View>
        )}

        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            orders.length === 0 && styles.emptyListContainer
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerButton: {
    padding: 8,
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  orderDetails: {
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceDetails: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  driverName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  bookFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
  },
});
