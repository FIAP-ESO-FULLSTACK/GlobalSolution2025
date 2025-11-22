// screens/Menu.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { fetchUserCourses, CourseData } from '../services/courseService'; 

// ===== TIPOS (Reutilizados do Home) =====
interface UserData {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
}

type Props = {
  user: UserData;
  token: string;
  onLogout?: () => void | Promise<void>;
};

// ===== MOCK DATA (Apenas para teste, agora com 6 cursos) =====
const MOCK_COURSES: CourseData[] = [
  { id: '1', title: 'Curso de React Native', progress: 45 },
  { id: '2', title: 'Introdução a JavaScript', progress: 80 },
  { id: '3', title: 'Design de UI/UX', progress: 10 },
  { id: '4', title: 'Banco de Dados SQL', progress: 0 },
  { id: '5', title: 'API com Spring Boot', progress: 25 },
  { id: '6', title: 'Metodologias Ágeis', progress: 50 },
];

// Componente "Botão de Menu" reutilizável
const MenuRow: React.FC<{ icon: string; text: string; onPress: () => void }> = ({
  icon,
  text,
  onPress,
}) => (
  <TouchableOpacity style={styles.menuRow} onPress={onPress}>
    <Text style={styles.menuRowIcon}>{icon}</Text>
    <Text style={styles.menuRowText}>{text}</Text>
    <Text style={styles.menuRowArrow}>›</Text>
  </TouchableOpacity>
);

const Menu: React.FC<Props> = ({ user, token, onLogout }) => {
  // --- Estados para os Cursos ---
  const [courses, setCourses] = useState<CourseData[]>([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);

  // --- Efeito para carregar os cursos ---
  useEffect(() => {
    const loadCourses = async () => {
      if (!user.id || !token) {
        setCourses(MOCK_COURSES); 
        return;
      }
      
      setIsLoading(true);
      try {
        // **AQUI ENTRA SUA CHAMADA DE API REAL**
        // const data = await fetchUserCourses(user.id, token);
        // setCourses(data);
        
        // Simulação de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCourses(MOCK_COURSES); 

      } catch (error) {
        // <-- CORREÇÃO AQUI: Variável 'error' usada
        console.error("Erro ao carregar progresso:", error); 
        Alert.alert('Erro', 'Não foi possível carregar seu progresso.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [user.id, token]);

  // --- Funções de placeholder do Menu ---
  const handleEditProfile = () => Alert.alert('Ação', 'Navegar para Editar Perfil');
  const handleSettings = () => Alert.alert('Ação', 'Navegar para Configurações');
  const handleAbout = () => Alert.alert('Ação', 'Navegar para Sobre');

  // --- Função de Logout ---
  const handleLogout = () => {
    if (onLogout) {
      Alert.alert(
        'Sair',
        'Você tem certeza que deseja sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: onLogout },
        ],
        { cancelable: true }
      );
    }
  };

  // --- Renderizador da lista de Cursos ---
  const renderCourseList = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }
    
    if (courses.length === 0) {
      return <Text style={styles.emptyText}>Nenhum curso em progresso.</Text>;
    }

    const coursesToShow = isProgressExpanded ? courses : courses.slice(0, 3);

    return (
      <View>
        {coursesToShow.map((c) => (
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
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 1. CABEÇALHO DO USUÁRIO */}
      <View style={styles.header}>
        {user.profile_image_url ? (
          <Image source={{ uri: user.profile_image_url }} style={styles.avatar} />
        ) : (
          <Image source={require('../assets/Image.png')} style={styles.avatar} />
        )}
        <Text style={styles.name}>{user.name || 'Usuário'}</Text>
        <Text style={styles.email}>{user.email || 'Não informado'}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* 2. SEÇÃO DE CURSOS */}
      <View style={styles.courseSection}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => setIsProgressExpanded(!isProgressExpanded)}
          disabled={isLoading || courses.length <= 3} 
        >
          <Text style={styles.sectionTitle}>Meu Progresso</Text>
          {courses.length > 3 && (
            <Text style={styles.sectionArrow}>
              {isProgressExpanded ? '⌄' : '›'}
            </Text>
          )}
        </TouchableOpacity>

        {renderCourseList()}
      </View>

      {/* 3. SEÇÃO DE CONFIGURAÇÕES */}
      <View style={styles.menuSection}>
        <MenuRow icon="⚙️" text="Configurações" onPress={handleSettings} />
        <MenuRow icon="ℹ️" text="Sobre o App" onPress={handleAbout} />
      </View>

      {/* 4. SEÇÃO DE LOGOUT */}
      <View style={styles.menuSection}>
        <MenuRow icon="🚪" text="Sair" onPress={handleLogout} />
      </View>
      
      <View style={styles.footerSpacer} /> {/* <-- CORREÇÃO AQUI: Estilo movido */}
    </ScrollView>
  );
};

// ===== ESTILOS (Com novas adições) =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
  // Seção de Cursos
  loader: {
    marginTop: 20,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  courseSection: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  sectionArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF', 
  },
  flexOne: {
    flex: 1,
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#007AFF', 
    borderRadius: 6,
  },
  progressPercent: {
    marginLeft: 16,
    width: 50,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF', 
  },

  // Seções do Menu
  menuSection: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
  },
  menuRowIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuRowText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuRowArrow: {
    fontSize: 16,
    color: '#ccc',
  },
  
  // <-- CORREÇÃO AQUI: Estilo 'footerSpacer' adicionado
  footerSpacer: {
    height: 30,
  },
});

export default Menu;