# GoTicket Frontend — Estrutura, Estado e Performance

## 1. Estrutura de diretórios real

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── assets/                # (se presente) mídias estáticas locais
├── components/
│   ├── layout/            # Headers, footers, shells de página
│   ├── shared/            # Componentes de domínio reutilizados entre features
│   └── ui/                # shadcn/ui + primitivas Radix
├── features/
│   ├── admin/
│   │   ├── admin-categories/
│   │   ├── admin-clients/
│   │   ├── admin-events/
│   │   ├── admin-organizers/
│   │   └── admin-venues/
│   │       └── { components/, hooks/, services/, types/ }
│   ├── auth/              # { components/, hooks/, services/, types/ }
│   ├── event-details/     # { components/, hooks/, services/, types/, utils/ }
│   └── public-landing/    # { components/, hooks/ }
├── layouts/               # Layouts de rota
├── lib/                   # utils.ts (cn helper, etc.) — apenas utilidades puras
├── pages/                 # Páginas (entrada de rotas)
├── services/
│   └── api.ts             # Instância Axios global (default export `goTicketApi`)
├── stores/
│   └── authStore.ts       # Único Zustand store hoje
├── types/                 # Tipos compartilhados entre features
└── utils/                 # Helpers compartilhados
```

Regra prática para feature nova:
- Subpasta em `src/features/<nome>/` com `components/`, `hooks/`, `services/`, `types/` (e `utils/` se precisar).
- Estado local da feature: hook custom + `useState`/`useReducer`. **Não criar slice Zustand por feature** sem antes alinhar — hoje só `authStore` é global.
- Imports sempre via alias `@/` (já configurado no `tsconfig` e `vite.config.ts`).

## 2. Estado global (Zustand)
- Há **um único store**: `src/stores/authStore.ts`. Ele é referenciado pelo interceptor do Axios em `services/api.ts` para deslogar quando o refresh falha.
- **Imutabilidade**: nunca mutar arrays/objetos do store (`state.x.push(...)` é proibido). Use spread, `map`, `filter`.
- Antes de criar um store novo, considere se um hook custom + estado local já resolve.

## 3. Componentes e estilização
- **Tailwind CSS 4 exclusivo.** Tokens vêm do `index.css` / configuração do plugin Vite (`@tailwindcss/vite`). Não introduzir CSS solto sem necessidade real.
- **shadcn/ui antes de criar do zero.** Botões, dialogs, dropdowns, selects, etc. já estão (ou podem ser adicionados via CLI) em `components/ui/`. Verifique antes de implementar.
- **`cn()` helper**: combine classes com `clsx` + `tailwind-merge` via `@/lib/utils`. Não concatene strings de classe à mão.
- **Variantes**: use `class-variance-authority` (já no `package.json`) para variantes de componente em vez de cascatas de `if`.

## 4. Comunicação HTTP
- Toda chamada passa por `import goTicketApi from '@/services/api'`. **Não** importar `axios` direto em features (a única exceção legítima já está em `services/api.ts`, no fluxo de refresh, para evitar recursão de interceptor).
- O token é injetado pelo interceptor — não setar `Authorization` manualmente em chamadas de feature.
- Tokens vivem em `localStorage` (`accessToken`, `refreshToken`, `tokenExpiration`). Mantenha esses nomes — o interceptor depende deles.
- Em caso de 401, o interceptor enfileira a requisição, faz refresh em `${VITE_API_URL}/auth/refresh` e reexecuta. Não duplicar essa lógica em features.

## 5. Forms
- Padrão: `react-hook-form` + `zod` via `@hookform/resolvers`. Schemas de validação ficam junto do form (em `types/` ou no próprio componente, conforme reuso).

## 6. Roteamento
- `react-router-dom` v7. Rotas montadas a partir de `App.tsx` / `pages/` / `layouts/`. Mantenha layouts em `layouts/` e páginas (componentes top-level de uma rota) em `pages/`.

## 7. Konva (mapa de assentos)
- `react-konva` é usado **apenas** na camada de apresentação do mapa de evento.
- Estado de seleção (livre/ocupado/escolhido) deve ser gerenciado fora do `Stage`, em estado React/Zustand, e passado já calculado para os shapes — evite re-render do `Stage` inteiro a cada clique.
- Para muitos shapes, prefira `Layer` separado para a parte estática vs. interativa.

## 8. Animação e UX (libs já no projeto)
- `framer-motion` para transições. `lenis` para smooth scroll global. `swiper` para carrosséis. `lucide-react` para ícones. Use o que já está antes de adicionar nova lib.

## 9. Persistência visual
Componentes adjacentes a um controle interativo (ex: bloco "compre junto", painel lateral) **não devem desmontar/remontar** quando o usuário interage com o controle principal. Causas comuns: usar `key` dinâmica, recriar o pai a cada render, ou condicionar a render a um estado que reseta. Estabilize a árvore antes de "consertar com `useMemo`".

## 10. Estética visual
Componentes com caráter estético inspirado no glassmorphism, com blur, sombras bem definidas e gradientes de azul, além de sempre possuir bordar bem arredondadas, assim como podemos ver nas pastas `/components` dentro dos domínios de cada implementação na pasta `/features`
