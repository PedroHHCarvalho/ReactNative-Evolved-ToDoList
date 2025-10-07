import React, { useState, useEffect } from 'react'; 
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert, 
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';

// Chave de persistência local para o AsyncStorage.
// Estratégia de uso de chave única para evitar colisões com outros dados.
const STORAGE_KEY = '@TodoList:tasks';

// Função utilitária para geração de IDs únicos baseada no timestamp atual.
// NOTA: Em produção, uma biblioteca como 'uuid' seria preferível para maior robustez.
const generateId = () => Date.now().toString();

// --- Configuração para habilitação de LayoutAnimation no Android ---
// Necessário para garantir transições animadas fluidas em ambas as plataformas.
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
// ------------------------------------------------------------------

export default function App() {
  // Estado primário da aplicação. Armazena o array de objetos de tarefas.
  const [tasks, setTasks] = useState([]);
  
  // Estado para capturar o input de texto, desacoplando-o da lógica de tarefas.
  const [taskText, setTaskText] = useState('');

  /**
   * Função assíncrona responsável por carregar os dados persistidos.
   * Utiliza JSON.parse para converter a string armazenada de volta em array.
   */
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      // Tratamento de erro robusto para falhas de leitura.
      Alert.alert('Erro ao carregar', 'Houve um erro ao carregar as tarefas salvas.');
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  /**
   * Função assíncrona responsável por persistir o array de tarefas.
   * Utiliza JSON.stringify para conversão obrigatória para string.
   * @param {Array<Object>} currentTasks - O array de tarefas a ser salvo.
   */
  const saveTasks = async (currentTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks));
    } catch (error) {
      // Tratamento de erro para falhas de escrita.
      Alert.alert('Erro ao salvar', 'Houve um erro ao salvar as tarefas.');
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  // Efeito de Ciclo de Vida: Carregamento Inicial.
  // Executa 'loadTasks' apenas uma vez, na montagem inicial do componente, 
  // utilizando o array de dependências vazio ([]).
  useEffect(() => {
    loadTasks();
  }, []); 

  // Efeito de Ciclo de Vida: Persistência de Dados.
  // Dispara 'saveTasks' sempre que o estado 'tasks' for alterado, 
  // garantindo a sincronização imediata dos dados com o AsyncStorage.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]); 

  /**
   * Adiciona uma nova tarefa ao array de estado.
   * Utiliza 'prevTasks' no 'setTasks' para garantir que a atualização
   * do estado seja baseada no valor mais recente (evitando race conditions).
   */
  const addTask = () => {
    if (taskText.trim() === '') {
      return; 
    }
    const newTask = {
      id: generateId(),
      text: taskText.trim(),
      isCompleted: false,
    };
    
    // Insere a nova tarefa no início do array.
    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    setTaskText('');
    // Fechamento programático do teclado para melhor UX.
    Keyboard.dismiss(); 
  };

  /**
   * Alterna o status 'isCompleted' de uma tarefa específica.
   * Usa o método 'map' para criar um novo array, mantendo a imutabilidade do estado.
   * @param {string} id - O ID da tarefa a ser alterada.
   */
  const toggleTask = (id) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        // Usa spread operator para criar um novo objeto com o status invertido.
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    }));
  };
  
  /**
   * Remove uma tarefa do array, aplicando animação de layout.
   * @param {string} id - O ID da tarefa a ser removida.
   */
  const deleteTask = (id) => {
    // Aplica a animação 'easeInEaseOut' ao próximo ciclo de renderização.
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Filtra o array, mantendo apenas tarefas que não correspondam ao ID fornecido.
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };


  /**
   * Componente de renderização para cada item da lista (renderItem da FlatList).
   * Otimização de performance: idealmente, este seria um componente externo para 
   * evitar re-renderizações desnecessárias da lista inteira (memoização).
   * @param {Object} item - O objeto de tarefa a ser renderizado.
   */
  const TaskItem = ({ item }) => (
    <View style={styles.taskContainer}>
      {/* Checkbox de conclusão */}
      <TouchableOpacity 
        style={styles.checkBox}
        onPress={() => toggleTask(item.id)}
      >
        <Text style={item.isCompleted ? styles.checkMark : null}>{item.isCompleted ? '✓' : ''}</Text>
      </TouchableOpacity>
      
      {/* Texto da tarefa com estilo condicional (riscado se completo) */}
      <Text style={[styles.taskText, item.isCompleted && styles.taskCompletedText]}>
        {item.text}
      </Text>

      {/* Botão de exclusão com ícone MaterialIcons */}
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <MaterialIcons name="delete" size={24} color="#FF5A5F" />
      </TouchableOpacity>
    </View>
  );

  return (
    // SafeAreaView: Garante que o conteúdo não interfira com as barras de status/notificação.
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Minhas Tarefas Mobile</Text>
        
        {/* Input Controlado e Botão de Adicionar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Adicionar nova tarefa..."
            placeholderTextColor="#808080"
            value={taskText}
            onChangeText={setTaskText}
            // Permite adicionar a tarefa ao pressionar a tecla 'Enter' do teclado.
            onSubmitEditing={addTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <MaterialIcons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Lista de Tarefas */}
        <FlatList
          data={tasks} // Passa o array de estado.
          keyExtractor={(item) => item.id} // Chave única para otimizar re-renderizações.
          renderItem={TaskItem} // Componente de renderização de item.
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
        
      </View>
    </SafeAreaView>
  );
}

// --- Definição de Estilos (Stylesheet) ---
// Utilizando StyleSheet.create para performance (o React Native otimiza a injeção).
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#38A3A5', 
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#EAF4F4',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    // Estilos de sombra (iOS) e elevação (Android) para profundidade.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#57CC99', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    // Sombra sutil para itens da lista.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.41,
    elevation: 2,
  },
  taskText: {
    flex: 1, // Permite que o texto ocupe o espaço restante na linha.
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  taskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#808080',
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#57CC99',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkMark: {
    color: '#57CC99',
    fontWeight: 'bold',
  },
});