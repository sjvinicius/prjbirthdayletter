# GitHub Codespaces ♥️ Next.js

Welcome to your shiny new Codespace running Next.js! We've got everything fired up and running for you to explore Next.js.

You've got a blank canvas to work on from a git perspective as well. There's a single initial commit with the what you're seeing right now - where you go from here is up to you!

Everything you do here is contained within this one codespace. There is no repository on GitHub yet. If and when you’re ready you can click "Publish Branch" and we’ll create your repository and push up your project. If you were just exploring then and have no further need for this code then you can simply delete your codespace and it's gone forever.

To run this application:

```
npm run dev
```
# Um presente em forma de cartas

Uma página de aniversário construída com Next.js, TypeScript, Tailwind CSS e Supabase. Cada pessoa pode deixar uma mensagem e uma foto; as cartas aprovadas aparecem no mural e chegam em tempo real.

## Começar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Preencha `.env.local` com os dados do projeto Supabase antes de usar o formulário. `NEXT_BIRTHDAY_NAME` personaliza o nome no título e na página. `BIRTHDAY_SPECIAL_MESSAGE` recebe a carta do namorado. Esses valores não devem conter credenciais.

Defina também `NEXT_SITE_URL` com a URL pública ao publicar. Na Vercel, `VERCEL_URL` é usado como fallback.

## Supabase

1. Crie um projeto Supabase.
2. No SQL Editor, execute [`supabase/migrations/202609290001_birthday_wall.sql`](supabase/migrations/202609290001_birthday_wall.sql).
3. Copie a URL e a chave pública do projeto para `NEXT_SUPABASE_URL` e `NEXT_SUPABASE_ANON_KEY`.
4. Copie a chave `service_role` para `SUPABASE_SERVICE_ROLE_KEY`. Ela é usada somente na rota server-side; nunca adicione o prefixo `NEXT_`.

A migration habilita RLS, permite leitura pública apenas de mensagens aprovadas, configura o bucket público `birthday` para imagens e habilita `messages` no Supabase Realtime. A API é a única via de escrita pública e define mensagens como aprovadas após validar os dados. Não há dados de exemplo no banco.

As mensagens e fotos são públicas por decisão do produto. O formulário informa isso antes do envio. Fotos são limitadas a 3 MB e validadas no servidor pelo conteúdo real (JPEG, PNG ou WebP), além de MIME type e extensão.

## Personalização

- `NEXT_BIRTHDAY_NAME`: nome que aparece no hero e nos metadados.
- `BIRTHDAY_SPECIAL_MESSAGE`: texto que aparece ao abrir o envelope especial. Embora configurado no servidor, ele é enviado ao navegador como parte da página; use apenas conteúdo que possa ser público.
- O texto do hero e das seções fica nos componentes em `components/birthday/`.

## Verificações

```bash
npm run lint
npm run build
```

O rate limit da API é simples e em memória por instância, adequado para o MVP pessoal. Antes de uma campanha pública com tráfego relevante, substitua-o por um limitador compartilhado entre instâncias. O limite do bucket e as validações server-side continuam ativos independentemente dessa proteção.
