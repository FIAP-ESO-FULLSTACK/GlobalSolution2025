const BASE_URL = 'http://localhost:8080'; // WILL -> substituir pela url que leva as infos de login
export const login = async (email, password) => {
  if (email === 'teste@teste' && password === '123') {
    return {
      token: 'test-token-123',
      user: {
        email: 'teste@teste',
        name: 'Usuário Teste',
      },
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Email ou senha inválidos');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Erro na chamada de login:', error);
    throw error;
  }
};