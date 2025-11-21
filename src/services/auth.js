export const BASE_URL = 'http://localhost:8082'; // ajuste conforme o ambiente do backend Spring

/**
 * Autentica contra o Spring Security (formLogin em /login) e recebe cookie de sessão.
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include', // garante que o cookie JSESSIONID seja recebido/reenviado
      body: new URLSearchParams({
        username: email,
        password: password,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error('Email ou senha inválidos');
    }

    const message = await response.text();
    return {
      message: message || 'Login realizado com sucesso.',
      user: { email },
    };
  } catch (error) {
    console.error('Erro na chamada de login:', error);
    throw error;
  }
};
