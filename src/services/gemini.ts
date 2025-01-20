import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateMindMap(subject: string, topic: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Crie um mapa mental detalhado e abrangente sobre "${topic}" para a matéria de ${subject} do ENCCEJA.

O mapa deve seguir este formato JSON:
{
  "id": "root",
  "text": "${topic}",
  "children": [
    {
      "id": "conceito1",
      "text": "Conceito Principal 1",
      "children": [
        {
          "id": "sub1",
          "text": "Subconceito 1",
          "children": [
            {
              "id": "detalhe1",
              "text": "Detalhe 1",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}

Regras importantes:
- Exatamente 4 conceitos principais fundamentais para o tema
- 3-4 subconceitos detalhados por conceito principal
- 2-3 detalhes específicos por subconceito
- Textos concisos e claros (máximo 40 caracteres)
- Hierarquia lógica e coerente
- Foco no conteúdo cobrado no ENCCEJA
- Termos e conceitos adequados ao nível de ensino
- IDs únicos e descritivos
- Conexões significativas entre os conceitos
- Cobertura completa do tópico`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Formato JSON não encontrado na resposta');
    } catch (parseError) {
      console.error('Erro ao processar resposta:', parseError);
      throw new Error('Erro ao processar o mapa mental');
    }
  } catch (error) {
    console.error('Erro ao gerar mapa mental:', error);
    throw new Error('Não foi possível gerar o mapa mental no momento. Tente novamente mais tarde.');
  }
}

export async function generateSubjectContent(subject, topic) {
  try {
    // Definição de matérias que requerem fórmulas
    const mathSubjects = ['matemática', 'física', 'química'];
    const needsFormulas = 
      mathSubjects.includes(subject.toLowerCase()) || 
      ['cálculo', 'fórmula', 'equação'].some((term) => topic.toLowerCase().includes(term));

    // Obtenção do modelo generativo
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Construção do prompt
    const prompt = `
      Elabore um conteúdo educacional detalhado e didático sobre o tema "${topic}" na disciplina "${subject}". 
      Este conteúdo deve ser projetado para estudantes do ENCCEJA, focando em clareza, acessibilidade e aprendizado prático. 
      Utilize as diretrizes abaixo para estruturar o material:

      **Diretrizes Gerais:**
      - O conteúdo deve ser gradual, começando com conceitos básicos e progredindo para níveis avançados.
      - Expresse fórmulas matemáticas com MathJax, seguindo o padrão:
        - \\( ... \\) para expressões simples.
        - \\[ ... \\] para equações complexas ou destacadas.
      - Use o ponto (.) como separador decimal e defina claramente todas as variáveis utilizadas.

      **Estrutura do Conteúdo:**
      1. **Introdução**
         - Contextualize o tema, explicando sua relevância no cotidiano ou no mercado de trabalho.
         - Apresente os objetivos de aprendizado a serem alcançados.

      2. **Conceitos Fundamentais**
         - Explique os conceitos-chave de forma clara e objetiva.
         - Relacione esses conceitos a conhecimentos prévios ou áreas correlatas.

      3. **Desenvolvimento Teórico**
         - Aborde o tema de maneira detalhada, progressiva e alinhada ao público-alvo.
         ${needsFormulas ? '- Inclua fórmulas importantes e descreva o significado de cada variável, além de exemplos resolvidos passo a passo.' : ''}
         - Utilize analogias, esquemas ou comparações para tornar conceitos complexos mais acessíveis.

      4. **Exemplos Práticos**
         - Resolva no mínimo três exemplos que demonstrem a aplicação prática do conteúdo:
           - **Exemplo 1:** Simples e introdutório.
           - **Exemplo 2:** Moderado, com variações.
           - **Exemplo 3:** Avançado, integrando múltiplos conceitos abordados.

      5. **Aplicações no Cotidiano**
         - Mostre ao menos três exemplos de aplicação do tema em situações reais.
         - Destaque sua relevância para resolver problemas práticos ou compreender fenômenos do dia a dia.

      6. **Resumo**
         - Reforce os conceitos principais, garantindo que o estudante assimile os pontos mais relevantes.
         ${needsFormulas ? '- Liste as fórmulas essenciais abordadas e forneça dicas para memorização ou aplicação.' : ''}
         - Conclua com uma síntese clara dos aprendizados.

      7. **Conexões Interdisciplinares**
         - Explique como o tema se relaciona com outras disciplinas ou áreas de estudo.
         - Destaque sua importância para uma visão integrada do conhecimento.

      8. **Dicas Práticas e Verificação**
         - Proporcione dicas para facilitar o aprendizado e a retenção do conteúdo.
         - Inclua perguntas de revisão para que o estudante avalie sua compreensão.

      **Observação:** O conteúdo deve ser abrangente, bem estruturado, e adaptado ao nível de conhecimento do público-alvo. Utilize uma linguagem clara e didática.

      Boa sorte na construção do conteúdo educacional!
    `;

    // Gerar conteúdo com o modelo
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Erro ao gerar conteúdo:', error);
    throw new Error('Falha na geração do conteúdo. Por favor, tente novamente.');
  }
}




export async function generateFlashCards(subject: string, topic: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Crie exatamente 10 flashcards educacionais sobre "${topic}" para a matéria de ${subject} do ENCCEJA.

Retorne APENAS um array JSON com os flashcards no seguinte formato, sem texto adicional:

[
  {
    "question": "Pergunta 1?",
    "answer": "Resposta 1"
  },
  {
    "question": "Pergunta 2?",
    "answer": "Resposta 2"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Função para limpar o texto e extrair apenas o JSON válido
      const cleanJsonText = (text: string): string => {
        // Remove caracteres especiais comuns que podem causar problemas
        let cleaned = text
          .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // Aspas especiais
          .replace(/[\u2018\u2019]/g, "'") // Aspas simples especiais
          .replace(/\n/g, ' ') // Remove quebras de linha
          .trim();

        // Tenta encontrar o array JSON
        const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (!match) {
          throw new Error('Formato JSON não encontrado na resposta');
        }

        // Limpa ainda mais o JSON encontrado
        return match[0]
          .replace(/\s+/g, ' ') // Remove espaços extras
          .replace(/,\s*]/g, ']') // Remove vírgula extra no final do array
          .replace(/,\s*}/g, '}'); // Remove vírgula extra no final dos objetos
      };

      // Limpa e valida o JSON
      const cleanJson = cleanJsonText(text);
      
      // Tenta fazer o parse do JSON limpo
      const parsed = JSON.parse(cleanJson);
      
      // Valida se é um array e se tem a estrutura correta
      if (!Array.isArray(parsed)) {
        throw new Error('Resposta não é um array válido');
      }

      // Valida a estrutura de cada flashcard
      const validFlashcards = parsed.every(card => 
        typeof card === 'object' &&
        card !== null &&
        typeof card.question === 'string' &&
        typeof card.answer === 'string' &&
        card.question.trim() !== '' &&
        card.answer.trim() !== ''
      );

      if (!validFlashcards) {
        throw new Error('Estrutura dos flashcards inválida');
      }

      return parsed;
    } catch (parseError) {
      console.error('Erro ao processar resposta:', parseError);
      console.log('Texto recebido:', text); // Log para debug
      throw new Error('Erro ao processar os flashcards');
    }
  } catch (error) {
    console.error('Erro ao gerar flashcards:', error);
    throw new Error('Não foi possível gerar os flashcards no momento. Tente novamente mais tarde.');
  }
}

export async function generateExercises(subject: string, topic: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Crie 5 exercícios sobre "${topic}" para a matéria de ${subject} do ENCCEJA.
    IMPORTANTE: Certifique-se de incluir vírgulas entre TODOS os elementos dos arrays.
    
    Retorne um array JSON com objetos contendo id, pergunta, opções (array), resposta correta (índice) e explicação.
    
    Exemplo do formato esperado:
    [
      {
        "id": "ex1",
        "question": "Pergunta do exercício?",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
        "correctAnswer": 0,
        "explanation": "Explicação da resposta correta"
      }
    ]

    REGRAS:
    1. SEMPRE use vírgulas entre elementos dos arrays
    2. SEMPRE use aspas duplas para strings
    3. Mantenha exatamente 4 opções por questão
    4. Certifique-se que o JSON é válido`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Try to parse the response as JSON
      const exercises = JSON.parse(text);
      
      // Validate the structure
      if (!Array.isArray(exercises) || !exercises.every(exercise => 
        exercise && 
        typeof exercise === 'object' &&
        'id' in exercise &&
        'question' in exercise &&
        'options' in exercise &&
        'correctAnswer' in exercise &&
        'explanation' in exercise &&
        Array.isArray(exercise.options) &&
        exercise.options.length === 4 &&
        typeof exercise.correctAnswer === 'number'
      )) {
        throw new Error('Formato de resposta inválido');
      }
      
      return exercises;
    } catch (parseError) {
      console.error('Erro ao processar resposta:', parseError);
      console.log('Texto recebido:', text);
      
      // Try to fix common JSON formatting issues
      try {
        const fixedText = text
          .replace(/\]\s*\[/g, '], [')  // Add missing commas between array elements
          .replace(/"\s*"/g, '", "');    // Add missing commas between strings
        
        const exercises = JSON.parse(fixedText);
        if (Array.isArray(exercises)) {
          return exercises;
        }
      } catch (e) {
        // If fixing fails, throw the original error
        throw new Error('Erro ao processar os exercícios');
      }
      
      throw new Error('Erro ao processar os exercícios');
    }
  } catch (error) {
    console.error('Erro ao gerar exercícios:', error);
    throw new Error('Não foi possível gerar os exercícios no momento. Tente novamente mais tarde.');
  }
}

export async function generatePerformanceReport(
  subject: string,
  topic: string,
  results: { topic: string; correct: boolean }[]
) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const correctCount = results.filter(r => r.correct).length;
    const totalCount = results.length;
    const percentage = (correctCount / totalCount) * 100;

    const prompt = `Analise o desempenho em exercícios sobre "${topic}" na matéria de ${subject} do ENCCEJA.

Dados de desempenho:
- Acertos: ${correctCount} de ${totalCount} questões (${percentage}%)
- Tópicos das questões: ${results.map(r => r.topic).join(', ')}
- Padrão de erros: ${results.map((r, i) => `Questão ${i + 1}: ${r.correct ? 'Acerto' : 'Erro'}`).join(', ')}

Gere um relatório de desempenho que inclua:
1. Análise geral do desempenho
2. Identificação de pontos fortes e fracos
3. Recomendações específicas de estudo
4. Dicas práticas para melhorar
5. Próximos passos sugeridos

O relatório deve ser:
- Motivador e construtivo
- Específico para o nível ENCCEJA
- Com linguagem clara e acessível
- Focado em ações práticas
- Com no máximo 4 parágrafos`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    throw new Error('Não foi possível gerar o relatório no momento. Tente novamente mais tarde.');
  }
}