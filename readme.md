# palavras++

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=7M2BZQD5GJCSG)

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

### Como rodar?

Clone o repositório:

```
git clone https://github.com/csamuelsm/palavrasss
```

Na linha `socketio.run(app, host='192.168.0.5', debug=True)`, altere o argumento `host` para o seu IP ou então remova ele.

Instale as dependências e execute `app.py`:

```
python -m pip install -r requirements.txt
python app.py
```

Acesse o app em `http://localhost:5000` ou `http://<seu ip>:5000`.

### Agradecimentos

Obrigado aos pesquisadores do IME e PUC-SP pela disponibilização dos datasets.

#### Me pague um lanche

- Banco do Brasil:
    - **Chave PIX**: `csamuelssm@gmail.com`
    - **Nome**: `Cicero Samuel Santos Morais`
- [Nubank (link)](https://nubank.com.br/pagar/4vsyx/BtWyacDlWD)
- Paypal [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=7M2BZQD5GJCSG)

Se você tiver alguma sugestão, encontrar alguma palavra errada ou inapropriada ou quiser ajudar de alguma outra forma, fale comigo por `csamuelssm@gmail.com` ou abra uma issue.