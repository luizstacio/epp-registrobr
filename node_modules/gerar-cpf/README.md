# gerar-cpf
> Gerador de CPF

[![npm version](https://badge.fury.io/js/gerar-cpf.svg)](http://badge.fury.io/js/gerar-cpf)

```js
npm install gerar-cpf
```

## Uso
```js
var gerarCpf = require('gerar-cpf');
var listaCpf = [];

while (listaCpf.length < 100) {
  listaCpf[listaCpf.length] = gerarCpf();
}
```

## Parâmetros

#### mask: `Boolean|String`
> Padrão: `false|xxx.xxx.xxx-xx`

Especifica uma máscara para o CPF gerado. Caso esta contenha menos de 11 placeholders, um erro será disparado.

**Exemplo:**

```js
/* Boolean */
gerarCpf(true)
// 123.456.789-01

/* String */
gerarCpf('xxx-xxx-xx.xx')
// 123-456-789.01

gerarCpf('xxx xxx xx xx')
// 123 456 789 01
```

- - -

#### placeholder: `String`
> Padrão: `x`

Identifica o padrão de placeholder usado na máscara.

**Exemplo:**

```js
gerarCpf('nnnxnnnxnnnxnn', 'n')
// 123x456x789x01

gerarCpf('___x___x___x__', '_')
// 123x456x789x01

gerarCpf('<><><> <><><> <><><> <><>', '<>')
// 123 456 789 01
```

## Licensa
MIT
