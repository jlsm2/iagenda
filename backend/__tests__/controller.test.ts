import { TestController } from '../src/infrastructure/http/controllers/TestController';
import { GenerateRoutineUseCase } from '../src/application/usecases/GenerateRoutineUseCase';
import { ProcessMessageUseCase } from '../src/application/usecases/ProcessMessageUseCase';
import { Request, Response } from 'express';

// Mock dos Use Cases
jest.mock('../src/application/usecases/GenerateRoutineUseCase');
jest.mock('../src/application/usecases/ProcessMessageUseCase');

// Tipagem dos mocks
const MockedGenerateRoutineUseCase = GenerateRoutineUseCase as jest.MockedClass<typeof GenerateRoutineUseCase>;
const MockedProcessMessageUseCase = ProcessMessageUseCase as jest.MockedClass<typeof ProcessMessageUseCase>;

describe('TestController', () => {
  let controller: TestController;
  let mockGenerateRoutineUseCase: jest.Mocked<GenerateRoutineUseCase>;
  let mockProcessMessageUseCase: jest.Mocked<ProcessMessageUseCase>;
  
  // Mocks para os objetos 'req' e 'res' do Express.js
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJsonMock: jest.Mock;
  let responseStatusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGenerateRoutineUseCase = new MockedGenerateRoutineUseCase() as jest.Mocked<GenerateRoutineUseCase>;
    mockProcessMessageUseCase = new MockedProcessMessageUseCase() as jest.Mocked<ProcessMessageUseCase>;
    
    controller = new TestController(mockProcessMessageUseCase, mockGenerateRoutineUseCase);

    responseJsonMock = jest.fn();
    responseStatusMock = jest.fn().mockReturnValue({ json: responseJsonMock });
    mockRequest = {
      body: {},
    };
    mockResponse = {
      json: responseJsonMock,
      status: responseStatusMock,
    };
  });

  describe('generateUserRoutine', () => {
    it('deve chamar o GenerateRoutineUseCase e retornar a rotina com status 200 em caso de sucesso', async () => {
      // Arrange
      const activities = {
        fixedActivities: [{ name: 'Trabalho', startTime: '09:00', endTime: '18:00' }],
        flexibleActivities: [{ name: 'Ler', duration: 30 }]
      };
      mockRequest.body = activities;

      const mockRoutineResponse = "09:00 - 18:00: Trabalho...";
      mockGenerateRoutineUseCase.execute.mockResolvedValue(mockRoutineResponse);

      // Act
      await controller.generateUserRoutine(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGenerateRoutineUseCase.execute).toHaveBeenCalledWith(activities.fixedActivities, activities.flexibleActivities);
      expect(responseJsonMock).toHaveBeenCalledWith({ response: mockRoutineResponse });
    });
    
    it('deve retornar um erro com status 400 se não houver atividades no corpo da requisição', async () => {
      // Arrange
      mockRequest.body = {};

      // Act
      await controller.generateUserRoutine(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(responseStatusMock).toHaveBeenCalledWith(400);
      expect(responseJsonMock).toHaveBeenCalledWith(expect.objectContaining({
        // --- CORREÇÃO AQUI ---
        // A mensagem de erro esperada agora corresponde à mensagem real do controller.
        error: expect.stringContaining('É necessário fornecer ao menos uma lista de atividades'),
      }));
      expect(mockGenerateRoutineUseCase.execute).not.toHaveBeenCalled();
    });
    
    it('deve retornar um erro com status 500 se o Use Case falhar', async () => {
        // Arrange
        const activities = { fixedActivities: [{ name: 'Reunião', startTime: '10:00', endTime: '11:00' }], flexibleActivities: [] };
        mockRequest.body = activities;
        const simulatedError = new Error('Falha na API do Gemini');
        mockGenerateRoutineUseCase.execute.mockRejectedValue(simulatedError);

        // Act
        await controller.generateUserRoutine(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(responseStatusMock).toHaveBeenCalledWith(500);
        expect(responseJsonMock).toHaveBeenCalledWith({ error: 'Erro interno ao gerar a rotina.' });
    });
  });

  describe('processUserMessage', () => {
    it('deve existir, mas não fazer nada por enquanto', async () => {
        mockRequest.body = { message: 'Olá' };
        await controller.processUserMessage(mockRequest as Request, mockResponse as Response);
        
        expect(responseJsonMock).not.toHaveBeenCalled();
        expect(responseStatusMock).not.toHaveBeenCalled();
    });
  });
});
