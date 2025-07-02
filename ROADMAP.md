# Roadmap

Os exercícios escolhidos para este desafio foram o Exercício 1 e o Exercício 3 de backend:
https://github.com/rubcube/hiring-exercises/blob/master/backend/Instructions.md#hist%C3%B3ria-1
https://github.com/rubcube/hiring-exercises/blob/master/backend/Instructions.md#hist%C3%B3ria-3

Sobre o Exercício 2, não vi desafios significativos para desenvolvê-lo, apenas pequenas dúvidas. Considerei o exercício 1 e 3 relevantes o suficientes para desmonstrar as skills de códigos e apresentação das soluções.

## O que eu adicionaria se tivesse mais tempo
- Separação melhor dos arquivos e estrutura das patas para padronizar.
- Melhorar a estrutura dos testes unitários, estão muito "soltos" e meio fora do padrão do Jest.
- Arquivo de rotas.
- Melhorias no README.
- Desenvolvimento do exercício 2, fiquei com algumas dúvidas.

## O que eu faria diferente se tivesse mais tempo
- Uma rotina que rodaria em fila (job) responsável por processar os logs e extrair as informações mais relevantes (mortes, causas, etc..), armazenando em uma base de dados. O Elasticsearch me parece uma opção adequada, já que é ótimo para cálculos, parsing e grandes volumes de dados. Com o uso do cursor e da função search_after no ELK, é possível realizar consultadas paginadas e garantir performance mesmo com grandes quantidades de informações. ;)