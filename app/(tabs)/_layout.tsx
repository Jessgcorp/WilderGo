import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarHidden,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          tabBarButton: (props) => (
            <View style={styles.unifiedPillContainer}>
              <BlurView intensity={80} tint="light" style={styles.pillBlur}>
                <View style={styles.tabItem}><Ionicons name="compass-outline" size={18} color="#2D5A27" /><Text style={styles.tabLabel}>Explore</Text></View>
                <View style={styles.tabItem}><Ionicons name="map-outline" size={18} color="#666" /><Text style={styles.tabLabel}>Map</Text></View>
                <View style={styles.tabItem}><Ionicons name="chatbubble-outline" size={18} color="#666" /><Text style={styles.tabLabel}>Chat</Text></View>
                <View style={[styles.tabItem, styles.communityBadge]}><Ionicons name="people-outline" size={18} color="#FFF" /><Text style={[styles.tabLabel, {color: '#FFF'}]}>Community</Text></View>
                <View style={[styles.tabItem, styles.sosBadge]}><Ionicons name="alert-circle" size={18} color="#FFF" /><Text style={[styles.tabLabel, {color: '#FFF'}]}>SOS</Text></View>
              </BlurView>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarHidden: { display: 'none' },
  unifiedPillContainer: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    width: width - 32,
  },
  pillBlur: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    gap: 4,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    letterSpacing: -0.2,
  },
  communityBadge: {
    backgroundColor: '#4A7c59',
    flex: 1.2,
  },
  sosBadge: {
    backgroundColor: '#D62246',
    flex: 0.8,
  },
});
