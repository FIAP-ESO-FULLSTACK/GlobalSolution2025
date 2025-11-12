import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBot from './ChatBot'; // Importar o componente ChatBot

export type Props = {
  user: any;
  onLogout?: () => void | Promise<void>;
};

const sampleCourses = [
  { id: '1', title: 'Curso de React Native', progress: 45 },
  { id: '2', title: 'Introdução a JavaScript', progress: 80 },
  { id: '3', title: 'Design de UI/UX', progress: 10 },
];

const Home: React.FC<Props> = ({ user, onLogout }) => {
  const [tab, setTab] = useState<'profile' | 'home' | 'chat'>('home');
  const insets = useSafeAreaInsets();

  const FOOTER_BASE_HEIGHT = 64;
  const footerHeight = FOOTER_BASE_HEIGHT;

  const displayName = (user && (user.user?.name || user.name)) || user?.user?.email || 'Usuário';

  const renderHomeMain = () => (
    <ScrollView contentContainerStyle={styles.mainScroll}>
      <Text style={styles.sectionTitle}>Seu Progresso</Text>
      {sampleCourses.map((c) => (
        <View key={c.id} style={styles.courseRow}>
          <View style={styles.flexOne}>
            <Text style={styles.courseTitle}>{c.title}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${c.progress}%` }]} />
            </View>
          </View>
          <Text style={styles.progressPercent}>{c.progress}%</Text>
        </View>
      ))}

      <Text style={[styles.sectionTitle, styles.sectionTitleMarginTop]}>Cursos Recomendados</Text>
      {sampleCourses.map((c) => (
        <View key={`rec-${c.id}`} style={styles.recommendCard}>
          <Text style={styles.courseTitle}>{c.title}</Text>
          <Text style={styles.courseDesc}>Breve descrição do curso recomendado.</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderProfile = () => (
    <View style={styles.mainCenter}>
      <Image source={require('../assets/Image.png')} style={styles.largeAvatar} />
      <Text style={styles.profileName}>{displayName}</Text>
      <Text style={styles.profileEmail}>{user?.user?.email || user?.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header - apenas aparece nas tabs home e profile */}
      {tab !== 'chat' && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={require('../assets/Image.png')} style={styles.avatar} />
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
          <View style={styles.headerRight}>
            {typeof onLogout === 'function' && (
              <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Main content */}
      <View style={[styles.main, tab !== 'chat' && { paddingBottom: footerHeight + insets.bottom + 12 }]}>
        {tab === 'home' && renderHomeMain()}
        {tab === 'profile' && renderProfile()}
        {tab === 'chat' && <ChatBot user={user} />}
      </View>

      {/* Footer - rodapé de navegação */}
      <View style={[styles.footer, { height: footerHeight + insets.bottom, paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.footerButton} onPress={() => setTab('profile')}>
          <Text style={[styles.footerIcon, tab === 'profile' && styles.footerIconActive]}>👤</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.footerCenterButton]} onPress={() => setTab('home')}>
          <View style={styles.centerCircle}>
            <Text style={styles.centerIcon}>🏠</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => setTab('chat')}>
          <Text style={[styles.footerIcon, tab === 'chat' && styles.footerIconActive]}>🤖</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff' },
  headerName: { marginLeft: 12, fontSize: 16, fontWeight: '600' },

  main: { flex: 1 },
  mainScroll: { padding: 16 },
  mainCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  largeAvatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  profileName: { fontSize: 22, fontWeight: '700' },
  profileEmail: { marginTop: 6, color: '#666' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sectionTitleMarginTop: { marginTop: 20 },
  flexOne: { flex: 1 },
  courseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  courseTitle: { fontSize: 16, fontWeight: '600' },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 6,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBarFill: { height: 10, backgroundColor: '#4caf50' },
  progressPercent: { marginLeft: 12, width: 50, textAlign: 'right' },

  recommendCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  courseDesc: { color: '#666', marginTop: 6 },

  footer: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  footerButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  footerIcon: { fontSize: 22, opacity: 0.5 },
  footerIconActive: { opacity: 1 },
  footerCenterButton: { marginTop: -12 },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: { color: '#fff', fontSize: 22 },

  logoutButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 6 },
  logoutText: { color: '#333', fontWeight: '600' },
});

export default Home;