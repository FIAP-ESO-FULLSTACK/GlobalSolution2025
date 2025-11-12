import { Message, Conversation } from '../screens/ChatBot';

//URL do backend spring
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Interface para requisição de chat
 */
interface ChatRequest {
  message: string;
  conversationId?: string;
  userId: string;
  history?: Message[];
}

/**
 * Interface para resposta de chat
 */
interface ChatResponse {
  message: string;
  conversationId: string;
  messageId: string;
  timestamp: Date;
}

/**
 * Envia uma mensagem para o LangChain e retorna a resposta
 * 
 * @param message - Mensagem do usuário
 * @param conversationId - ID da conversa atual (opcional)
 * @param userId - ID do usuário
 * @param history - Histórico de mensagens (opcional, para contexto)
 * @returns Resposta do LangChain
 */
export const sendMessageToLangChain = async (
  message: string,
  conversationId: string | null,
  userId: string,
  history: Message[] = []
): Promise<ChatResponse> => {
  try {
    const token = await getAuthToken();
    
    const requestBody: ChatRequest = {
      message,
      conversationId: conversationId || undefined,
      userId,
      history: history.slice(-10), // coloquei 10 para limitar o tamanho do contexto
    };

    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar mensagem');
    }

    const data = await response.json();
    
    return {
      message: data.message,
      conversationId: data.conversationId,
      messageId: data.messageId,
      timestamp: new Date(data.timestamp),
    };
  } catch (error) {
    console.error('Erro ao chamar LangChain API:', error);
    throw error;
  }
};

/**
 * Busca todas as conversas do usuário do banco de dados
 * 
 * @param userId - ID do usuário
 * @returns Lista de conversas
 */
export const fetchUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/conversations?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conversas');
    }

    const data = await response.json();
    
    return data.conversations.map((conv: any) => ({
      id: conv.id,
      title: conv.title,
      messages: conv.messages || [],
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
    }));
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    return []; // Retorna array vazio em caso de erro
  }
};

/**
 * Busca uma conversa específica com todas as mensagens
 * 
 * @param conversationId - ID da conversa
 * @returns Conversa completa com mensagens
 */
export const fetchConversation = async (conversationId: string): Promise<Conversation | null> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar conversa');
    }

    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      messages: data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    return null;
  }
};

/**
 * Cria uma nova conversa no banco de dados
 * 
 * @param userId - ID do usuário
 * @param title - Título da conversa
 * @returns Nova conversa criada
 */
export const createConversation = async (
  userId: string,
  title: string
): Promise<Conversation> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, title }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar conversa');
    }

    const data = await response.json();
    
    return {
      id: data.id,
      title: data.title,
      messages: [],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    throw error;
  }
};

/**
 * Deleta uma conversa do banco de dados
 * 
 * @param conversationId - ID da conversa
 * @returns true se deletado com sucesso
 */
export const deleteConversation = async (conversationId: string): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao deletar conversa:', error);
    return false;
  }
};

/**
 * Atualiza o título de uma conversa
 * 
 * @param conversationId - ID da conversa
 * @param title - Novo título
 * @returns true se atualizado com sucesso
 */
export const updateConversationTitle = async (
  conversationId: string,
  title: string
): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao atualizar título:', error);
    return false;
  }
};

/**
 * 
 * @returns Token de autenticação
 */
const getAuthToken = async (): Promise<string> => {
  return 'test-token-123';
};

/**
 * Exemplo WILL:
 * 
 * POST /api/chat/message
 * Body: {
 *   message: string,
 *   conversationId?: string,
 *   userId: string,
 *   history?: Message[]
 * }
 * 
 * Response: {
 *   message: string,
 *   conversationId: string,
 *   messageId: string,
 *   timestamp: string
 * }
 * 
 * ---
 * 
 * Estrutura do backend com LangChain nao sei como faria em C#:
 * 
 * from langchain.chat_models import ChatOpenAI
 * from langchain.memory import ConversationBufferMemory
 * from langchain.chains import ConversationChain
 * 
 * @app.post("/api/chat/message")
 * async def chat_message(request: ChatRequest):
 *     # Inicializar o modelo LangChain
 *     llm = ChatOpenAI(temperature=0.7)
 *     
 *     # Criar ou carregar memória da conversa
 *     memory = load_conversation_memory(request.conversationId)
 *     
 *     # Criar chain de conversa
 *     conversation = ConversationChain(
 *         llm=llm,
 *         memory=memory,
 *         verbose=True
 *     )
 *     
 *     # Processar mensagem
 *     response = conversation.predict(input=request.message)
 *     
 *     # Salvar mensagens no banco de dados
 *     save_messages_to_db(
 *         conversation_id=request.conversationId,
 *         user_message=request.message,
 *         bot_response=response
 *     )
 *     
 *     return {
 *         "message": response,
 *         "conversationId": request.conversationId,
 *         "messageId": generate_message_id(),
 *         "timestamp": datetime.now().isoformat()
 *     }
 */