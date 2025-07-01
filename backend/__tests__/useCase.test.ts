import { GenerateRoutineUseCase } from '../src/application/usecases/GenerateRoutineUseCase';
import { ProcessMessageUseCase } from '../src/application/usecases/ProcessMessageUseCase';
import { InteractionRepository } from '../src/infrastructure/repositories/InteractionRepository';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Definição de tipos para as atividades (provavelmente você já tem isso em algum lugar)
interface FixedActivity {
  name: string;
  startTime: string;
  endTime: string;
}

interface FlexibleActivity {
  name: string;
  duration: number;
}

// --- MOCK DAS DEPENDÊNCIAS ---
// A sintaxe do mock muda um pouco para funcionar bem com o TypeScript
jest.mock('@google/generative-ai');
jest.mock('../src/infrastructure/repositories/InteractionRepository');

// Tipando os mocks para ter autocomplete e segurança de tipos
const MockedGoogleGenerativeAI = GoogleGenerativeAI as jest.MockedClass<typeof GoogleGenerativeAI>;
const MockedInteractionRepository = InteractionRepository as jest.MockedClass<typeof InteractionRepository>;

// --- SUÍTE DE TESTES: GenerateRoutineUseCase ---
describe('GenerateRoutineUseCase', () => {
  let generateRoutineUseCase: GenerateRoutineUseCase;
  let mockInteractionRepository: jest.Mocked<InteractionRepository>;

  // Variável para o mock da função principal da IA
  const mockGenerateContent = jest.fn();

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();

    // Configura o retorno do mock da classe da IA
    MockedGoogleGenerativeAI.prototype.getGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });

    generateRoutineUseCase = new GenerateRoutineUseCase();
    // A instância do repositório dentro do use case será a instância mockada
    mockInteractionRepository = (MockedInteractionRepository as any).mock.instances[0];
  });

  it('deve retornar uma mensagem de erro se nenhuma atividade for fornecida', async () => {
    const result = await generateRoutineUseCase.execute([], []);
    
    expect(result).toBe("Por favor, forneça ao menos uma atividade (fixa ou flexível) para gerar a rotina.");
    expect(mockGenerateContent).not.toHaveBeenCalled();
    expect(mockInteractionRepository.save).not.toHaveBeenCalled();
  });
  
  it('deve chamar a API do Gemini e salvar a interação em caso de sucesso', async () => {
    // Arrange
    const fixedActivities: FixedActivity[] = [{ name: 'Trabalho', startTime: '09:00', endTime: '18:00' }];
    const flexibleActivities: FlexibleActivity[] = [{ name: 'Estudar', duration: 60 }];
    const mockApiResponse = "09:00 - 18:00: Trabalho";
    
    // Configura o mock para resolver com uma resposta de sucesso
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockApiResponse,
      },
    });

    // Act
    const result = await generateRoutineUseCase.execute(fixedActivities, flexibleActivities);
    
    // Assert
    expect(result).toBe(mockApiResponse);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockInteractionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockInteractionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        response: mockApiResponse,
    }));
  });
  
  it('deve salvar a interação com erro se a API do Gemini falhar', async () => {
    // Arrange
    const fixedActivities: FixedActivity[] = [{ name: 'Trabalho', startTime: '09:00', endTime: '18:00' }];
    const errorMessage = 'API Error';
    mockGenerateContent.mockRejectedValue(new Error(errorMessage));

    // Act
    const result = await generateRoutineUseCase.execute(fixedActivities, []);

    // Assert
    expect(result).toBe("Desculpe, ocorreu um erro ao tentar gerar sua rotina com a API.");
    expect(mockInteractionRepository.save).toHaveBeenCalledTimes(1);
    expect(mockInteractionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        error: errorMessage,
    }));
  });
});

// --- SUÍTE DE TESTES: ProcessMessageUseCase ---
describe('ProcessMessageUseCase', () => {
  let processMessageUseCase: ProcessMessageUseCase;
  const mockGenerateContent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    MockedGoogleGenerativeAI.prototype.getGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent,
    });
    processMessageUseCase = new ProcessMessageUseCase();
  });

  it('deve chamar a API do Gemini com a mensagem do usuário e retornar a resposta', async () => {
    // Arrange
    const userMessage = "Olá, Gemini!";
    const mockApiResponse = "Olá! Como posso ajudar?";
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => mockApiResponse,
      },
    });

    // Act
    const result = await processMessageUseCase.execute(userMessage);

    // Assert
    expect(result).toBe(mockApiResponse);
    expect(mockGenerateContent).toHaveBeenCalledWith(userMessage);
  });
});