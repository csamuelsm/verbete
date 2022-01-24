# palavras++

Este é um clone dos jogos [term.ooo](https://term.ooo/) e [wordle](https://www.powerlanguage.co.uk/wordle/). Porém, você não precisa jogar só uma vez por dia.

- Jogue quantas vezes quiser
- Ajuste o tamanho das palavras entre 4 e 8 letras
- Selecione a quantidade de tentativas
- Escolha o nível de dificuldade das palavras:
    - Palavras muito usadas
    - Palavras medianamente usadas
    - Palavras pouco usadas

### Como funciona?

Para as palavras, é utilizado o [dicionário br.ispell](https://www.ime.usp.br/~pf/dicios/index.html). Esse dicionário é cruzado com a [lista de frequências do corpus brasileiro](http://corpusbrasileiro.pucsp.br/cb/Acesso.html). Os arquivos `words4.csv`, `words5.csv`, ..., `words10.csv` são as palavras de 4, 5, ..., 10 letras obtidas desse cruzamento. A média e o desvio padrão das frequências são calculados e os níveis de dificuldade das palavras são divididos da seguinte maneira:

- `frequencia < media`: difícil
- `media <= frequencia <= media + desvio padrão`: normal
- `frequencia > media`: fácil

Toda vez que o jogador clica em "jogar", uma palavra é selecionada de acordo com as configurações que foram escolhidas.

### Agradecimentos

Obrigado aos pesquisadores do IME e PUC-SP pela disponibilização dos datasets.

#### Me pague um lanche

- **Chave PIX**: `csamuelssm@gmail.com`
- **Nome**: `Cicero Samuel Santos Morais`