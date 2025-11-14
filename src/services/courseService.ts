// Assumindo que seu auth.js está em services/
import { BASE_URL } from './auth'; 

// Você pode querer um token real aqui, 
// vindo do AsyncStorage ou de um Contexto
const getAuthToken = async (): Promise<string> => {
  // Por enquanto, vamos pegar o token que o login "mockou"
  // No app real, você salvaria o token no AsyncStorage após o login
  // e leria dele aqui.
  // const token = await AsyncStorage.getItem('userToken');
  // return token || '';
  return 'test-token-123'; // Apenas para fins de exemplo
};

/**
 * Define a estrutura de um curso vindo da API
 */
export interface CourseData {
  id: string;       // Ex: "uuid-12345"
  title: string;    // Ex: "Curso de React Native"
  progress: number; // Ex: 45
  // Adicione outros campos que sua API retornar (ex: imageUrl, description)
}

/**
 * Busca os cursos em progresso de um usuário específico
 * * @param userId - O ID do usuário logado
 * @param token - O token JWT para autorização
 * @returns Uma promessa com a lista de cursos
 */
export const fetchUserCourses = async (
  userId: string,
  token: string
): Promise<CourseData[]> => {
  try {
    // Exemplo de endpoint: /api/users/{userId}/courses
    const response = await fetch(`${BASE_URL}/api/users/${userId}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Envia o token de autorização que veio do login
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar cursos');
    }

    const data: CourseData[] = await response.json();
    return data;

  } catch (error) {
    console.error('Erro no serviço fetchUserCourses:', error);
    // Retorna um array vazio em caso de erro para não quebrar a UI
    return []; 
  }
};