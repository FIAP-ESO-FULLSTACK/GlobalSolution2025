import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  user: any;
};

const ChatBot: React.FC<Props> = ({ user }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    // substituido por dados reais quando integrar com backend / conversas salvas do usuário conectado
    {
      id: '1',
      title: 'Introdução ao React Native',
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Como funciona o LangChain?',
      messages: [],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
    },
    {
      id: '3',
      title: 'Dúvidas sobre JavaScript',
      messages: [],
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 259200000),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  const scrollRef = useRef<ScrollView | null>(null);
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const sidebarWidth = Math.min(320, Math.floor(width * 0.45));

  useEffect(() => {
    if (width < 700) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }, [width]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Anima a resposta com um "Pensando..." seguido de digitação gradual
  const typeAssistantResponse = (responseText: string, convId: string, userMessage: Message) => {
    const assistantId = `assistant-${Date.now()}`;
    const baseAssistant: Message = {
      id: assistantId,
      role: 'assistant',
      content: 'Pensando...',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, baseAssistant]);

    const startTyping = () => {
      setIsLoading(false); // remove o indicador "Pensando..." enquanto digita
      let index = 0;
      const step = 3; // número de caracteres por "tick"
      const interval = setInterval(() => {
        index += step;
        const currentText = responseText.slice(0, index);

        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantId ? { ...msg, content: currentText } : msg))
        );

        if (index >= responseText.length) {
          clearInterval(interval);
          const finalAssistant = { ...baseAssistant, content: responseText };
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === convId
                ? {
                    ...conv,
                    messages: [...conv.messages, userMessage, finalAssistant],
                    updatedAt: new Date(),
                  }
                : conv
            )
          );
          setIsLoading(false);
        }
      }, 20);
    };

    // breve pausa antes de começar a digitar, imitando "pensando..."
    setTimeout(startTyping, 600);
  };

  // Resposta simulada com ramificações simples para Python e Java
  const buildAssistantResponse = (question: string): string => {
    const lower = question.toLowerCase();

    if (lower.includes('python')) {
      return (
        'Temos um curso fictício chamado "Lógica de Programação com Python". ' +
        'Nele você pratica decomposição de problemas, raciocínio com variáveis, condicionais e loops, ' +
        'além de estruturar funções pequenas e reutilizáveis. ' +
        'A lógica de programação é o passo a passo que organiza o pensamento antes mesmo do código; ' +
        'Python é perfeito para isso porque a sintaxe é simples e deixa você focar no raciocínio.'
      );
    }

    if (lower.includes('java')) {
      return (
        'Para perguntas sobre Java, recomendo o curso fictício "Estruturação de Classes em Java". ' +
        'Você aprende a modelar domínios em classes, organizar atributos e métodos e criar relações claras entre objetos. ' +
        'Java usa classes porque segue o paradigma de orientação a objetos: ' +
        'encapsula estado/comportamento, facilita reuso (herança/interfaces) e deixa o código modular e testável.'
      );
    }

    return `Esta é uma resposta simulada para: "${question}"\n\nQuando integrar o LangChain, esta mensagem será substituída pela resposta real da IA.`;
  };

  // Função para criar nova conversa
  const createNewConversation = () => {
    const newConv: Conversation = {
      id: String(Date.now()),
      title: 'Nova Conversa',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations([newConv, ...conversations]);
    setCurrentConversationId(newConv.id);
    setMessages([]);
  };

  // Função para carregar conversa
  const loadConversation = (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (conv) {
      setCurrentConversationId(convId);
      setMessages(conv.messages);
    }
  };

  // Função para deletar conversa
  const deleteConversation = (convId: string) => {
    setConversations(conversations.filter((c) => c.id !== convId));
    if (currentConversationId === convId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  };

  // Função para enviar mensagem
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Se não há conversa ativa, cria uma nova
    let convId = currentConversationId;
    if (!convId) {
      const newConv: Conversation = {
        id: String(Date.now()),
        title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations([newConv, ...conversations]);
      convId = newConv.id;
      setCurrentConversationId(convId);
    }

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // const response = await callLangChainAPI(text, messages);
    // Simulação de resposta (resposta do LangChain)
    setTimeout(() => {
      if (!convId) {
        setIsLoading(false);
        return;
      }
      const responseText = buildAssistantResponse(text);
      typeAssistantResponse(responseText, convId, userMessage);
    }, 1500);
  };

  const renderSidebar = () => (
    <View style={[styles.sidebar, { width: sidebarWidth }]}>
      <View style={styles.sidebarHeader}>
        <TouchableOpacity style={styles.newChatButton} onPress={createNewConversation}>
          <Text style={styles.newChatIcon}>✏️</Text>
          <Text style={styles.newChatText}>Nova Conversa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.conversationList}>
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={[
              styles.conversationItem,
              currentConversationId === conv.id && styles.conversationItemActive,
            ]}
            onPress={() => loadConversation(conv.id)}
          >
            <View style={styles.conversationItemContent}>
              <Text
                style={styles.conversationTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                💬 {conv.title}
              </Text>
              <Text style={styles.conversationDate}>
                {formatDate(conv.updatedAt)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sidebarFooter}>
        <Text style={styles.sidebarFooterText}>
          {user?.user?.name || user?.name || 'Usuário'}
        </Text>
        <Text style={styles.sidebarFooterEmail}>
          {user?.user?.email || user?.email}
        </Text>
      </View>
    </View>
  );

  const renderMessage = (msg: Message) => {
    const isUser = msg.role === 'user';
    return (
      <View
        key={msg.id}
        style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}
      >
        <View style={styles.messageIcon}>
          <Text style={styles.messageIconText}>{isUser ? '👤' : '🤖'}</Text>
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{msg.content}</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🤖</Text>
      <Text style={styles.emptyStateTitle}>Como posso ajudar você hoje?</Text>
      <Text style={styles.emptyStateSubtitle}>
        Faça uma pergunta ou inicie uma conversa
      </Text>
    </View>
  );

  return (
    // ===== ALTERAÇÃO: Removido paddingTop: insets.top daqui =====
    <View style={styles.container}> 
      <View style={styles.content}>
        {sidebarVisible && renderSidebar()}
        
        <View style={styles.chatArea}>
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.toggleSidebarButton}
              onPress={() => setSidebarVisible(!sidebarVisible)}
            >
              <Text style={styles.toggleSidebarIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>
              {currentConversationId
                ? conversations.find((c) => c.id === currentConversationId)?.title || 'Conversa'
                : 'ChatBot IA'}
            </Text>
          </View>

          <KeyboardAvoidingView
            style={styles.chatBody}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0} // Ajuste fino, se necessário
          >
            <ScrollView
              ref={scrollRef}
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.length === 0 ? (
                renderEmptyState()
              ) : (
                messages.map((msg) => renderMessage(msg))
              )}
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={styles.loadingText}>Pensando...</Text>
                </View>
              )}
            </ScrollView>

            {/* Este paddingBottom já estava correto e cuida do espaço do "home indicator" */}
            <View style={[styles.inputContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }]}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua mensagem..."
                  placeholderTextColor="#999"
                  value={input}
                  onChangeText={setInput}
                  multiline
                  maxLength={4000}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
                  onPress={sendMessage}
                  disabled={!input.trim() || isLoading}
                >
                  <Text style={styles.sendButtonText}>↑</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Hoje';
  if (days === 1) return 'Ontem';
  if (days < 7) return `${days} dias atrás`;
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
  return date.toLocaleDateString('pt-BR');
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f7f7f8',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  sidebarHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  newChatIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  newChatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  conversationItemActive: {
    backgroundColor: '#e5e5e5',
  },
  conversationItemContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  conversationDate: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  sidebarFooterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sidebarFooterEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  toggleSidebarButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  toggleSidebarIcon: {
    fontSize: 20,
    color: '#333',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chatBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
    minHeight: '100%',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageIconText: {
    fontSize: 18,
  },
  messageContent: {
    flex: 1,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8, // Adicionado um padding superior
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f7f7f8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingTop: Platform.OS === 'ios' ? 8 : 0, // Ajuste de padding para iOS
    paddingBottom: Platform.OS === 'ios' ? 8 : 0, // Ajuste de padding para iOS
    color: '#333',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: Platform.OS === 'ios' ? 4 : 0, // Leve ajuste para alinhar no iOS
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatBot;
