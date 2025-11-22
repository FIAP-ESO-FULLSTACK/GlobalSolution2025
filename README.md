# 📱 GlobalSolution2025 (Lumigen)

Projeto desenvolvido em React Native. Este documento guia o processo de configuração do ambiente, instalação de dependências e execução em Android e iOS.

---

## ⚙️ Referência do Ambiente (Versões)

Para garantir que o projeto compile corretamente, certifique-se de que seu ambiente de desenvolvimento (Android Studio / JDK) suporte as seguintes versões definidas no `build.gradle` e `gradle-wrapper.properties`.

| Ferramenta / SDK | Versão |
| :--- | :--- |
| **Gradle** | `9.0.0` |
| **Kotlin** | `2.1.20` |
| **Android Build Tools** | `36.0.0` |
| **Compile SDK** | `36` |
| **Target SDK** | `36` |
| **Min SDK** | `24` |
| **NDK** | `27.1.12297006` |

---

## 🚀 Guia de Instalação e Execução

Siga os passos abaixo estritamente na ordem para evitar erros de configuração.

### 1. Clonar e Preparar
O erro mais comum é esquecer de entrar na pasta do projeto.

```bash
# 1. Clone o repositório
git clone <URL_DO_SEU_REPO>

# 2. Entre na pasta do projeto (IMPORTANTE)
cd GlobalSolution2025

# 3. Instale as dependências do Node
npm install

2. Configuração Específica: iOS (Mac Only)

O iOS requer a instalação manual das dependências nativas (Pods).
Bash

# 1. Entre na pasta ios
cd ios

# 2. Instale os Pods
pod install

# 3. Volte para a raiz do projeto
cd ..

    Nota para Mac Apple Silicon (M1/M2/M3): Se o comando pod install falhar, tente: arch -x86_64 pod install

3. Configuração Específica: Android

O Android baixa o Gradle e dependências automaticamente na primeira execução.

    Certifique-se de ter um emulador aberto ou um dispositivo físico conectado via USB (com depuração USB ativada).

    Verifique se o arquivo android/local.properties existe apontando para seu SDK (se não existir, o Android Studio cria automaticamente ao abrir a pasta android).

4. Rodando o Aplicativo

Com tudo configurado, abra dois terminais na raiz do projeto (GlobalSolution2025).

Terminal 1: Iniciar o Metro Bundler
Bash

npm start

Terminal 2: Instalar no dispositivo

Para iOS:
Bash

npm run ios
# ou
npx react-native run-ios

Para Android:
Bash

npm run android
# ou
npx react-native run-android

🛠 Solução de Problemas (Troubleshooting)

Erro: Task :app:installDebug FAILED (Android)

Se o build falhar, geralmente é necessário limpar o cache do Gradle.
Bash

cd android
./gradlew clean
cd ..
npx react-native run-android

Erro: Unable to open base configuration... (iOS)

Isso significa que os Pods não foram instalados ou estão corrompidos.
Bash

cd ios
rm -rf Pods
rm -rf Podfile.lock
pod install
cd ..

Erro de Versão do Java/Gradle

Como este projeto usa Gradle 9.0.0, certifique-se de estar usando o Java JDK 17 ou superior. Verifique sua versão com:
Bash

java -version