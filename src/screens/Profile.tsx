import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator, 
  Alert,             
} from 'react-native';
import { 
  fetchUserCourses, 
  CourseData 
} from '../services/courseService'; 

// ===== TIPOS =====

interface UserData {
  id: string;
  name: string;
  email: string;
  profile_image_url?: string;
}

type Props = {
  user: UserData; 
  token: string;  
};

// ==========================================================
// ===== ALTERAÇÃO 1: ADICIONADO DADOS DE EXEMPLO AQUI =====
// ==========================================================
const MOCK_COURSES: CourseData[] = [
  { id: '1', title: 'Curso de React Native (Exemplo)', progress: 45 },
  { id: '2', title: 'Introdução a JavaScript (Exemplo)', progress: 80 },
  { id: '3', title: 'Design de UI/UX (Exemplo)', progress: 10 },
  { id: '4', title: 'Spring Boot Básico (Exemplo)', progress: 25 },
];
// ==========================================================


const Profile: React.FC<Props> = ({ user, token }) => {
  // ===== ESTADO =====
  
  // ================================================================
  // ===== ALTERAÇÃO 2: Use MOCK_COURSES para iniciar o estado =====
  // ================================================================
  const [courses, setCourses] = useState<CourseData[]>(MOCK_COURSES); // Antes: ([])
  // ================================================================

  const [isLoading, setIsLoading] = useState(false); // Mantido como false

  // ===== EFEITO (BUSCA DE DADOS) =====
  useEffect(() => {
    const loadCourses = async () => {
      if (!user.id || !token) {
        return;
      }
      
      // =========================================================
      // ===== ALTERAÇÃO 3: LÓGICA DA API PAUSADA (COMENTADA) =====
      // =========================================================
      
      // setIsLoading(true); // Comentado
      
      // try {
      //   // 4. Chama o serviço de API
      //   const data = await fetchUserCourses(user.id, token);
      //   setCourses(data); // 5. Salva os dados no estado
      // } catch (error) {
      //   Alert.alert('Erro', 'Não foi possível carregar seus cursos.');
      // } finally {
      //   setIsLoading(false); // Para de carregar (com sucesso ou erro)
      // }

      // =========================================================
    };

    loadCourses(); 
  }, [user.id, token]); 

  // ===== RENDERIZAÇÃO DO CONTEÚDO DOS CURSOS =====
  const renderCourseContent = () => {
    // 6. Mostra o indicador de loading
    if (isLoading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
    }

    // 7. Mostra mensagem se não houver cursos
    if (courses.length === 0) {
      return <Text style={styles.emptyText}>Nenhum curso em progresso encontrado.</Text>;
    }

    // 8. Renderiza a lista de cursos vinda do estado (agora com MOCK_COURSES)
    return (
      <>
        <Text style={styles.sectionTitle}>Seu Progresso</Text>
        {courses.map((c) => (
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
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.mainScroll}>
      {/* Bloco de Perfil (usa 'user' da prop) */}
      <View style={styles.profileHeader}>
        {user.profile_image_url ? (
          <Image source={{ uri: user.profile_image_url }} style={styles.largeAvatar} />
        ) : (
          <Image source={require('../assets/Image.png')} style={styles.largeAvatar} />
        )}
        <Text style={styles.profileName}>{user.name || 'Usuário'}</Text>
        <Text style={styles.profileEmail}>{user.email || ''}</Text>
      </View>

      {/* Conteúdo dos Cursos (Carregado da API) */}
      {renderCourseContent()}
    </ScrollView>
  );
};

// ===== ESTILOS =====
const styles = StyleSheet.create({
  mainScroll: {
    padding: 16,
    flexGrow: 1, // Garante que o ScrollView possa crescer
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  profileEmail: {
    marginTop: 6,
    color: '#666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  sectionTitleMarginTop: {
    marginTop: 20,
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
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  progressPercent: {
    marginLeft: 16,
    width: 50,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '600',
    color: '#4caf50',
  },
});

export default Profile;