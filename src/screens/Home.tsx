import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView, 
  FlatList,   
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBot from './ChatBot';
import Menu from './Menu'; 

// ===== TIPOS =====
interface CourseData {
  id: string;
  title: string;
  progress: number;
  imageUrl?: string; 
}

interface UserData {
  id: string; 
  name: string;
  email: string;
  profile_image_url?: string;
}

interface AuthData {
  token: string;
  user: UserData;
}

export type Props = {
  user: AuthData; 
  onLogout?: () => void | Promise<void>;
};

interface UserProfile extends UserData {}

// ===== MOCK DATA (Dashboard) =====
const MOCK_RESUME_COURSE: CourseData = {
  id: 'react-native-101',
  title: 'Curso Avançado de React Native',
  progress: 60,
  imageUrl: 'https://reactjs.org/logo-og.png',
};
const MOCK_MANDATORY: CourseData[] = [
  {
    id: 'sec-101',
    title: 'Segurança da Informação (Obrigatório)',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'lgpd-101',
    title: 'Compliance e LGPD',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=800&q=80',
  },
];
const MOCK_RECOMMENDED: CourseData[] = [
  {
    id: 'ia-101',
    title: 'Fundamentos de IA para Colaboradores',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'time-101',
    title: 'Gestão de Tempo e Produtividade',
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  },
];
// ====================================================

const fetchUserProfile = async (_userId: string): Promise<UserProfile | null> => {
  return null;
};

const Home: React.FC<Props> = ({ user: authData, onLogout }) => { 
  const [tab, setTab] = useState<'menu' | 'home' | 'chat'>('home'); 
  const [userProfile, setUserProfile] = useState<UserProfile | null>(authData.user);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const insets = useSafeAreaInsets();

  // --- Estados do Dashboard da Home ---
  const [resumeCourse, setResumeCourse] = useState<CourseData | null>(null);
  const [mandatoryCourses, setMandatoryCourses] = useState<CourseData[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<CourseData[]>([]);
  const [isHomeLoading, setIsHomeLoading] = useState(false);

  useEffect(() => {
    // (useEffect para Header)
    const loadUserProfile = async () => {
      const userId = authData.user.id;
      if (userId && !userProfile) { 
        setLoadingProfile(true);
        const profile = await fetchUserProfile(userId);
        if (profile) {
          setUserProfile(profile);
        }
        setLoadingProfile(false);
      }
    };
    
    loadUserProfile(); // <-- CORREÇÃO AQUI: Chamada da função descomentada
    
  }, [authData.user, userProfile]);

  
  // --- useEffect para carregar dados do Dashboard ---
  useEffect(() => {
    if (tab === 'home') {
      loadHomeDashboard();
    }
  }, [tab, authData.user.id]); 

  
  /**
   * Busca os dados para o dashboard da home.
   */
  const loadHomeDashboard = async () => {
    setIsHomeLoading(true);
    try {
      // --- SIMULAÇÃO DE CHAMADA DE API ---
      // const resume = await fetchResumeCourse(authData.user.id, authData.token);
      // const mandatory = await fetchMandatoryCourses(authData.user.id, authData.token);
      // const recommended = await fetchRecommendedCourses(authData.token);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      setResumeCourse(MOCK_RESUME_COURSE);
      setMandatoryCourses(MOCK_MANDATORY);
      setRecommendedCourses(MOCK_RECOMMENDED);
      // --- FIM DA SIMULAÇÃO ---

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setIsHomeLoading(false);
    }
  };

  const FOOTER_BASE_HEIGHT = 60;
  const footerHeight = FOOTER_BASE_HEIGHT;

  const rawAuthUser = authData.user as Record<string, any>;
  const displayName = 'Enrico';
  const userEmail =
    userProfile?.email ||
    rawAuthUser?.email ||
    rawAuthUser?.EMAIL ||
    '';
  const profileImageUrl =
    userProfile?.profile_image_url ||
    rawAuthUser?.profile_image_url ||
    rawAuthUser?.profileImageUrl;
  const greetingMessage = 'Boa noite';

  // ===== RENDERIZAÇÃO DOS CARDS DE CURSO (HORIZONTAL) =====
  const renderCourseList = ({ title, courses }: { title: string, courses: CourseData[] }) => {
    if (courses.length === 0) return null;

    return (
      <View style={styles.courseListSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.courseCard}>
              <Image 
                source={{ uri: item.imageUrl || 'https://placehold.co/400x300/eeeeee/999999?text=Curso' }} 
                style={styles.courseImage} 
              />
              <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.courseListPadding}
        />
      </View>
    );
  };

  // ===== RENDER HOME MAIN (AGORA É O DASHBOARD) =====
  const renderHomeMain = () => {
    if (isHomeLoading) {
      return (
        <View style={styles.mainCenter}>
          <ActivityIndicator size="large" color={styles.primaryColor.color} />
        </View>
      );
    }

    return (
      <ScrollView style={styles.homeContainer}>
        {/* 1. Card "Continuar Aprendendo" */}
        {resumeCourse && (
          <TouchableOpacity style={styles.resumeCard}>
            <Image 
              source={{ uri: resumeCourse.imageUrl || 'https://placehold.co/600x400/eeeeee/999999?text=Curso' }} 
              style={styles.resumeImage} 
            />
            <View style={styles.resumeTextContainer}>
              <Text style={styles.resumeSubtitle}>Continuar aprendendo</Text>
              <Text style={styles.resumeTitle}>{resumeCourse.title}</Text>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${resumeCourse.progress}%` }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.resumeButton}>
              <Text style={styles.resumeButtonText}>Continuar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}

        {/* 2. Lista "Minhas Trilhas" */}
        {renderCourseList({ title: "Minhas Trilhas", courses: mandatoryCourses })}

        {/* 3. Lista "Descobrir Cursos" */}
        {renderCourseList({ title: "Descobrir Cursos", courses: recommendedCourses })}

        <View style={styles.spacer} />
        {/* <-- CORREÇÃO AQUI: Estilo movido */}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      {tab !== 'chat' && (
        <View style={styles.header}>
          <View style={styles.userRow}>
            <View style={styles.avatarWrapper}>
              {loadingProfile ? (
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
              ) : profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} style={styles.avatar} />
              ) : (
                <Image source={require('../assets/Image.png')} style={styles.avatar} />
              )}
            </View>

            <View style={styles.userInfoBlock}>
              <Text style={styles.greetingText}>{greetingMessage}</Text>
              <Text style={styles.userFullName} numberOfLines={1}>{displayName}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
            </View>

            <View style={styles.academyContainer}>
              <Text style={styles.academyTitle}>Lumigen Academy</Text>
            </View>
          </View>
        </View>
      )}

      {/* Conteúdo Principal */}
      <View style={styles.main}>
        {tab === 'home' && renderHomeMain()}
        
        {/* Renderiza 'Menu' com todas as props necessárias */}
        {tab === 'menu' && (
          <Menu 
            user={authData.user} 
            token={authData.token} 
            onLogout={onLogout} 
          />
        )}
        
        {tab === 'chat' && <ChatBot user={authData} />}
      </View>

      {/* Footer (Usa ☰ para 'menu') */}
      <View style={[styles.footer, { height: footerHeight + insets.bottom, paddingBottom: insets.bottom }]}>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => setTab('menu')}>
          <Text style={[styles.footerIcon, tab === 'menu' && styles.footerIconActive]}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, styles.footerCenterButton]} onPress={() => setTab('home')}>
          <View style={[
            styles.centerCircle, 
            tab === 'home' && styles.centerCircleActive 
          ]}>
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

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#007aff'; 
const ACADEMY_COLOR = '#0b3c7f';

// ===== ESTILOS =====
const styles = StyleSheet.create({
  primaryColor: { color: PRIMARY_COLOR, },
  container: { flex: 1, backgroundColor: '#f5f5f5', },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eef3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userInfoBlock: {
    flex: 1,
  },
  greetingText: {
    color: '#6b7280',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userFullName: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  userEmail: { fontSize: 13, color: '#4b5563', marginTop: 2, },
  academyContainer: {
    marginLeft: 'auto',
    paddingLeft: 12,
  },
  academyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ACADEMY_COLOR,
  },
  main: { flex: 1, backgroundColor: '#f5f5f5', }, 
  mainCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', },
  homeContainer: { flex: 1, paddingTop: 16, },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resumeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumeImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  resumeTextContainer: { padding: 16, },
  resumeSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
  },
  resumeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
    marginBottom: 12,
  },
  resumeButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  resumeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e6e6e6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { 
    height: 8, 
    backgroundColor: PRIMARY_COLOR, 
    borderRadius: 4,
  },
  courseListSection: { marginBottom: 24, },
  courseListPadding: { paddingHorizontal: 16, },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: width * 0.4, // 40% da tela
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  courseImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    padding: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  footerButton: { flex: 1, alignItems: 'center', justifyContent: 'center',},
  footerIcon: { fontSize: 22, opacity: 0.5, },
  footerIconActive: { opacity: 1, color: PRIMARY_COLOR, },
  footerCenterButton: { marginTop: -12, },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerCircleActive: { backgroundColor: PRIMARY_COLOR, },
  centerIcon: { color: '#fff', fontSize: 22, },
  
  // <-- CORREÇÃO AQUI: Estilo 'spacer' adicionado
  spacer: {
    height: 20,
  },
});

export default Home;
