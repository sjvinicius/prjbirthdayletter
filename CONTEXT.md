# Projeto: Presente de Aniversário Interativo

## 1. Visão geral

Criar uma aplicação web de aniversário para minha namorada.

A aplicação será uma experiência interativa de uma única página, construída com:

* Next.js
* TypeScript
* Supabase
* Tailwind CSS
* Vercel para hospedagem futura

O objetivo não é criar um site de aniversário genérico, mas uma experiência digital em que amigos e familiares possam participar do presente deixando **envelopes virtuais com mensagens e fotos de parabéns**.

A ideia principal é:

> A aniversariante recebe uma página com uma mensagem principal e vários envelopes espalhados pela interface. Cada envelope representa uma pessoa que quis deixar uma mensagem para ela.

As mensagens e fotos enviadas pelos visitantes ficam armazenadas no Supabase e podem ser visualizadas por outras pessoas.

---

# 2. Conceito da experiência

A aplicação deve transmitir a sensação de uma **mesa/parede cheia de cartas e envelopes físicos**, e não de um dashboard ou sistema administrativo.

A interface deve ser:

* romântica
* divertida
* pessoal
* elegante
* minimalista
* interativa
* responsiva
* agradável em celular e desktop

O foco deve estar nos envelopes.

A experiência deve parecer um presente digital.

---

# 3. Fluxo principal

O visitante acessa a página.

A primeira tela apresenta uma mensagem de aniversário escrita pelo namorado.

Exemplo conceitual:

> Feliz aniversário, meu amor ❤️
>
> Mas aparentemente eu não fui o único que quis te deixar uma mensagem...

Depois da mensagem inicial, o usuário encontra vários envelopes espalhados pela página.

Cada envelope representa uma mensagem enviada por uma pessoa.

O visitante pode:

1. visualizar envelopes existentes;
2. abrir envelopes;
3. ler mensagens;
4. visualizar fotos;
5. reagir às mensagens;
6. enviar seu próprio envelope.

---

# 4. Estrutura de uma única página

A aplicação deve funcionar principalmente como uma experiência one-page.

Não criar várias páginas desnecessariamente.

A página pode ser dividida visualmente em seções:

## Seção 1 — Hero

Apresentar:

* nome da aniversariante;
* mensagem principal;
* uma fotografia ou elemento visual relacionado ao casal;
* pequena introdução explicando que outras pessoas também deixaram mensagens.

Exemplo:

> Feliz aniversário, [NOME] ❤️
>
> Hoje é seu dia.
>
> E algumas pessoas também quiseram fazer parte dele.

Abaixo:

> 💌 Você recebeu mensagens de pessoas especiais.

---

# 5. Parede/mural de envelopes

Essa é a principal seção da aplicação.

Mostrar diversos envelopes visualmente espalhados pela tela.

Os envelopes devem ter:

* pequenas diferenças de posição;
* rotação;
* estilos;
* cores;
* selos;
* pequenos elementos decorativos.

Evitar uma grade tradicional de cards.

A intenção é criar uma composição semelhante a:

```text
              ✉️

      ✉️                 ✉️

              ✉️

  ✉️                     ✉️

            🎁

       ✉️          ✉️
```

Os envelopes devem parecer objetos físicos posicionados sobre uma mesa ou mural.

---

# 6. Envelopes

Cada envelope representa uma mensagem.

Ao clicar:

1. executar uma animação de abertura;
2. revelar a mensagem;
3. mostrar o nome da pessoa;
4. mostrar a foto, caso exista;
5. permitir reações.

A abertura deve ser uma interação visual agradável.

Não utilizar simplesmente um modal padrão sem animação.

Pode utilizar Framer Motion ou outra solução adequada para animações.

---

# 7. Conteúdo de um envelope

Cada mensagem pode conter:

### Obrigatório

* nome da pessoa;
* mensagem.

### Opcional

* foto de parabéns;
* foto adicional;
* emoji/reação.

Exemplo:

```text
┌───────────────────────────────┐
│                               │
│           💌                  │
│                               │
│  Para: [Nome da aniversariante]
│                               │
│  "Espero que seu dia seja    │
│   incrível..."                │
│                               │
│            — João             │
│                               │
│       [foto enviada]          │
│                               │
│       ❤️  😂  🎉  🥹         │
└───────────────────────────────┘
```

---

# 8. Criação de envelope

Deve existir uma ação clara:

> 💌 Deixar um envelope

Ao clicar, abrir uma interface para o visitante preencher:

### Nome

Campo obrigatório.

### Mensagem

Campo obrigatório.

### Foto

Campo opcional.

A instrução para a foto deve incentivar criatividade.

Exemplo:

> 📸 Deixe uma foto de parabéns.
>
> Quanto mais maluca, melhor.

A ideia é incentivar:

* caretas;
* poses engraçadas;
* fotos improvisadas;
* fotos com animais;
* montagens;
* decorações;
* fotos constrangedoras/divertidas.

Não exigir que a foto seja bonita ou profissional.

---

# 9. Galeria de fotos

Criar uma seção para mostrar as fotos enviadas.

Título conceitual:

> 📸 Galeria da vergonha

ou:

> 📸 As melhores fotos de parabéns

As fotos devem aparecer em um mural visual.

A galeria deve priorizar:

* fotos;
* diversão;
* variedade;
* responsividade.

Não precisa exibir todas as mensagens nessa seção.

A ideia é criar um segundo espaço de interação.

---

# 10. Contador

Exibir estatísticas simples.

Exemplo:

> 💌 27 pessoas deixaram mensagens
>
> 📸 19 fotos enviadas

O contador deve ser alimentado pelos dados reais do Supabase.

Não criar números fictícios.

---

# 11. Envelope aleatório

Adicionar uma ação:

> 🎲 Abrir um envelope aleatório

Ao clicar:

1. selecionar uma mensagem existente;
2. abrir a animação do envelope;
3. mostrar o conteúdo.

Isso incentiva visitantes a explorar mensagens de outras pessoas.

---

# 12. Reações

Permitir pequenas reações nas mensagens.

Sugestões:

* ❤️
* 😂
* 🎉
* 🥹

As reações devem ser simples.

Não criar sistema complexo de comentários.

A intenção é apenas permitir uma pequena interação entre visitantes.

---

# 13. Envelope especial

Deve existir um envelope especial pertencente ao namorado.

Esse envelope deve ser visualmente diferente dos demais.

Pode aparecer como:

> ❤️ Abra por último

ou

> 🎁 Um envelope especial

A ideia é que ele seja o fechamento da experiência.

Ele deve conter a mensagem principal/pessoal do namorado.

Pode existir alguma condição visual para desbloqueá-lo, por exemplo:

* depois de abrir alguns envelopes;
* depois de determinado número de mensagens;
* ou simplesmente ficar disponível como um envelope especial.

A implementação deve priorizar a experiência e não criar uma regra artificial difícil de entender.

---

# 14. Atualização em tempo real

Utilizar Supabase Realtime quando fizer sentido.

Exemplo:

Pessoa A está acessando a página.

Pessoa B envia um envelope.

A pessoa A deve conseguir receber o novo envelope sem precisar atualizar a página.

O novo envelope pode aparecer com uma animação:

> 💌 Novo envelope!

Depois ele entra no mural.

Essa funcionalidade é importante porque dá sensação de que o presente está sendo construído coletivamente.

---

# 15. Compartilhamento

Depois que uma pessoa enviar seu envelope, mostrar uma confirmação.

Exemplo:

> ❤️ Agora você também faz parte do presente.

Opcionalmente oferecer:

> Compartilhe com alguém que ainda não participou.

O compartilhamento pode utilizar a API nativa de compartilhamento do navegador quando disponível.

Não exigir cadastro de usuário.

---

# 16. Autenticação dos visitantes

Não exigir login.

O visitante deve conseguir enviar uma mensagem informando apenas:

* nome;
* mensagem;
* foto opcional.

Porém, a aplicação deve possuir alguma forma de proteção contra spam.

Possibilidades:

* rate limiting;
* captcha;
* validação server-side;
* limite de tamanho da mensagem;
* limite de tamanho da imagem;
* validação de MIME type;
* moderação.

A solução deve ser simples e adequada para um projeto pessoal.

---

# 17. Supabase

Utilizar Supabase como:

* banco de dados;
* Storage;
* Realtime.

Estrutura inicial sugerida:

## messages

```text
id
name
message
photo_url
envelope_style
approved
created_at
```

## reactions

```text
id
message_id
reaction
created_at
```

Pode ser criada uma tabela separada para fotos caso isso seja tecnicamente vantajoso, mas não criar tabelas sem necessidade.

---

# 18. Storage

Utilizar Supabase Storage para imagens.

Sugestão de bucket:

```text
birthday
```

Ou buckets separados caso isso melhore a organização:

```text
birthday-messages
birthday-gallery
```

As imagens devem ser armazenadas de forma segura.

Não armazenar imagens diretamente no banco.

No banco deve ser armazenado apenas o caminho/referência necessária.

---

# 19. Moderação

As mensagens enviadas pelos visitantes não devem necessariamente aparecer imediatamente.

Utilizar:

```text
approved = false
```

por padrão, caso seja necessário moderar.

A arquitetura deve permitir futuramente uma área administrativa para:

* visualizar mensagens;
* aprovar;
* rejeitar;
* excluir;
* visualizar fotos.

A área administrativa não precisa fazer parte da primeira versão da interface pública.

---

# 20. Segurança

Nunca expor:

* `SUPABASE_SERVICE_ROLE_KEY`;
* credenciais privadas;
* secrets.

A service role key deve existir somente no backend/server-side quando realmente necessária.

As operações públicas devem respeitar RLS.

Configurar corretamente:

* Row Level Security;
* policies;
* validação server-side;
* limites de upload;
* validação de extensão/MIME;
* sanitização de conteúdo.

Não confiar apenas na validação do frontend.

---

# 21. Design

O design deve ser contemporâneo e delicado.

Evitar:

* excesso de rosa;
* corações em excesso;
* gradientes exagerados;
* aparência de template pronto;
* estética infantil;
* excesso de elementos piscando;
* aparência de aplicativo administrativo.

A experiência deve parecer um presente pessoal.

Sugestão visual:

* fundo quente/off-white;
* envelopes em tons variados;
* vermelho/bordô utilizado pontualmente;
* sombras suaves;
* textura discreta de papel;
* tipografia elegante;
* animações suaves.

A estética pode combinar:

**carta física + scrapbook moderno + experiência digital.**

---

# 22. Responsividade

Mobile é prioridade.

A maioria dos convidados provavelmente acessará pelo celular.

A experiência deve funcionar muito bem em:

* Android;
* iPhone;
* desktop;
* tablet.

No mobile, os envelopes podem ocupar uma área maior e formar uma composição vertical.

Evitar interações que dependam exclusivamente de hover.

---

# 23. Animações

Utilizar animações com propósito.

Exemplos:

### Entrada

Elementos aparecem suavemente.

### Envelope

Ao clicar:

* envelope sobe;
* abre;
* conteúdo aparece.

### Novo envelope

Quando uma mensagem chega em tempo real:

* pequeno destaque;
* envelope aparece;
* animação de entrada.

### Galeria

Fotos podem utilizar pequenas animações ao aparecer.

Evitar animações excessivas.

Respeitar:

```css
prefers-reduced-motion
```

quando possível.

---

# 24. Arquitetura Next.js

Utilizar App Router.

Estrutura conceitual:

```text
app/
  page.tsx
  layout.tsx

components/
  birthday/
    Hero.tsx
    EnvelopeWall.tsx
    Envelope.tsx
    EnvelopeModal.tsx
    CreateEnvelope.tsx
    PhotoGallery.tsx
    BirthdayStats.tsx
    RandomEnvelope.tsx
    SpecialEnvelope.tsx

lib/
  supabase/
    client.ts
    server.ts

types/
  birthday.ts
```

A estrutura pode ser adaptada conforme a implementação.

Não criar abstrações excessivas para um projeto pequeno.

---

# 25. Componentização

Os principais componentes devem ser independentes.

Exemplo:

```text
<Hero />

<EnvelopeWall>
    <Envelope />
    <Envelope />
    <Envelope />
</EnvelopeWall>

<CreateEnvelope />

<PhotoGallery />

<BirthdayStats />

<SpecialEnvelope />
```

A aplicação deve evitar um `page.tsx` gigantesco.

---

# 26. Server e Client Components

Utilizar Server Components quando fizer sentido.

Utilizar Client Components somente onde houver:

* estado;
* interação;
* animação;
* Supabase Realtime;
* formulário;
* eventos do navegador.

Não transformar a aplicação inteira em Client Component sem necessidade.

---

# 27. Performance

A aplicação deverá futuramente ser hospedada na Vercel.

Considerar:

* Next Image;
* otimização das imagens;
* lazy loading;
* compressão;
* tamanhos máximos de upload;
* evitar downloads desnecessários;
* evitar consultas excessivas ao Supabase;
* paginação ou limite de mensagens caso o volume cresça.

A aplicação deve continuar rápida mesmo com dezenas ou centenas de envelopes.

---

# 28. SEO e compartilhamento

Apesar de ser uma experiência pessoal, configurar corretamente:

* title;
* description;
* Open Graph;
* favicon;
* imagem de compartilhamento.

Exemplo conceitual:

```text
Feliz aniversário, [NOME] ❤️
```

Ao compartilhar o link, deve aparecer uma prévia bonita.

---

# 29. Dados e privacidade

Como pessoas estarão enviando fotos e mensagens pessoais:

* deixar claro que o conteúdo será exibido para outros visitantes;
* não coletar informações pessoais desnecessárias;
* não solicitar e-mail ou telefone;
* permitir exclusão/moderação pelo administrador;
* evitar exposição de metadados desnecessários.

As fotos devem ser tratadas como conteúdo público dentro da experiência.

---

# 30. O que NÃO fazer

Não transformar o projeto em:

* rede social;
* sistema de cadastro;
* aplicativo de mensagens;
* dashboard complexo;
* sistema de comentários;
* sistema de amizade;
* feed infinito;
* projeto cheio de páginas.

O conceito central é:

> **Uma página de aniversário onde pessoas deixam envelopes digitais contendo mensagens e fotos.**

Tudo deve reforçar essa ideia.

---

# 31. MVP

A primeira versão deve conter obrigatoriamente:

### Público

* [ ] Hero com mensagem principal
* [ ] Mural de envelopes
* [ ] Abertura animada dos envelopes
* [ ] Visualização da mensagem
* [ ] Upload de foto
* [ ] Criação de envelope
* [ ] Supabase Database
* [ ] Supabase Storage
* [ ] Contador de mensagens
* [ ] Galeria de fotos
* [ ] Envelope aleatório
* [ ] Envelope especial
* [ ] Responsividade
* [ ] Validação dos formulários

### Realtime

* [ ] Novo envelope aparecendo sem refresh

### Segurança

* [ ] RLS
* [ ] validação server-side
* [ ] limites de upload
* [ ] proteção básica contra spam

---

# 32. Pós-MVP

Possíveis melhorias futuras:

* [ ] Reações
* [ ] Área administrativa
* [ ] Moderação
* [ ] Compartilhamento
* [ ] Analytics
* [ ] Animações mais sofisticadas
* [ ] Cápsula do tempo
* [ ] Áudios
* [ ] Vídeos curtos
* [ ] contador regressivo para o aniversário
* [ ] modo especial ativado no dia do aniversário

Não implementar funcionalidades futuras antes de concluir o MVP.

---

# 33. Diretriz de desenvolvimento

Priorizar nesta ordem:

1. Experiência do usuário;
2. simplicidade;
3. responsividade;
4. segurança;
5. performance;
6. estética;
7. funcionalidades adicionais.

Não adicionar funcionalidades apenas porque são tecnicamente interessantes.

Cada funcionalidade deve contribuir para a ideia do presente.

---

# 34. Regra principal do projeto

Antes de implementar qualquer coisa, considerar:

> **“Isso faz a aniversariante sentir que recebeu um presente construído por várias pessoas?”**

Se a resposta for não, provavelmente a funcionalidade não é necessária.

A aplicação deve parecer uma experiência pessoal, não um produto SaaS.

---

# 35. Resultado esperado

Ao final, a experiência deve permitir que:

1. a aniversariante entre na página;
2. veja uma mensagem pessoal;
3. encontre dezenas de envelopes;
4. abra os envelopes;
5. descubra mensagens de amigos e familiares;
6. veja as fotos malucas enviadas;
7. perceba o presente crescendo;
8. abra o envelope especial;
9. termine a experiência com a mensagem pessoal do namorado.

O resultado deve ser algo que ela possa guardar e revisitar depois do aniversário.

---

## Stack final

```text
Next.js
TypeScript
Tailwind CSS
Supabase
Supabase Storage
Supabase Realtime
Framer Motion
Vercel
```

## Princípio visual

> **Carta física + scrapbook + experiência web moderna.**

## Princípio funcional

> **Cada pessoa adiciona um pequeno pedaço do presente.**

## Princípio emocional

> **A página começa como uma mensagem do namorado e termina mostrando quantas pessoas quiseram fazer parte dela.**
