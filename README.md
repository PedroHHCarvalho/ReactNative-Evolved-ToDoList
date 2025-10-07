# ReactNative-Evolved-ToDoList
# 📱 ReactNative - Evolved To-Do List

Este projeto é uma aplicação mobile de lista de tarefas desenvolvida em **React Native** (usando **Expo**) para demonstrar proficiência em gerenciamento de estado, persistência de dados local e animações fluidas em desenvolvimento mobile.

---

## ✨ Funcionalidades Principais

* **Adicionar Tarefas:** Campo de input controlado para inclusão de novas tarefas.
* **Marcação de Conclusão:** Funcionalidade de *toggle* para marcar tarefas como concluídas, aplicando estilo de texto riscado.
* **Exclusão:** Remoção de tarefas com aplicação de ícone **MaterialIcons**.
* **Persistência de Dados:** As tarefas são salvas localmente no dispositivo usando **AsyncStorage**, garantindo que a lista seja mantida mesmo após fechar e reabrir o aplicativo.
* **Animações de Layout:** Uso de `LayoutAnimation` para proporcionar transições suaves e fluidas ao excluir itens, melhorando significativamente a experiência do usuário (UX).

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia | Justificativa Técnica |
| :--- | :--- | :--- |
| **Framework** | **React Native** | Escolhido para o desenvolvimento *cross-platform* (iOS/Android) a partir de uma única base de código JavaScript. |
| **Ferramenta** | **Expo Go** | Ambiente que permite testes rápidos e eficientes no dispositivo móvel sem a necessidade de builds nativas complexas. |
| **Gerenciamento de Estado** | **`useState`** | Utilizado para gerenciar o array principal de tarefas (`tasks`) de forma eficiente e simples. |
| **Persistência** | **`AsyncStorage`** | Solução assíncrona e não volátil para armazenamento de pequenos volumes de dados localmente no dispositivo. |
| **Ciclo de Vida** | **`useEffect`** | Essencial para carregar os dados na montagem do componente e monitorar o estado de `tasks` para salvar automaticamente (persistem). |
| **UX/UI** | **`FlatList`** | Componente otimizado para renderização de grandes listas, garantindo alta performance. |
| **UX/UI** | **`LayoutAnimation`** | Ferramenta nativa do React Native para criação de animações suaves e performáticas. |

---

## 🛠️ Como Executar o Projeto

Para testar o aplicativo no seu celular ou emulador, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o **Node.js** e o aplicativo **Expo Go** instalado no seu dispositivo móvel.

### Instalação

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/SEU_USUARIO/ReactNative-Evolved-ToDoList.git](https://github.com/SEU_USUARIO/ReactNative-Evolved-ToDoList.git)
    cd ReactNative-Evolved-ToDoList
    ```

2.  Instale as dependências:
    ```bash
    npm install
    # Instalar AsyncStorage (dependência específica para persistência)
    npx expo install @react-native-async-storage/async-storage
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    # ou
    npx expo start
    ```

4.  Escaneie o **QR Code** exibido no terminal ou navegador usando o app **Expo Go** no seu celular para carregar a aplicação.

---

## 👨‍💻 Desenvolvedor

**[Pedro Henrique de Holanda Carvalho]**

* **GitHub:** [https://github.com/PedroHHCarvalho]
