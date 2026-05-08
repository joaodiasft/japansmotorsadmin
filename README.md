<div align="center">

<img src="https://i.im.ge/eJ704X/sss.png" alt="Japan Motors Logo" width="180"/>

# 🚗 Japan Motors — ERP de Gestão de Vendas

**Sistema completo de gerenciamento de contratos, veículos e clientes para revendas de automóveis**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Sobre o Sistema

O **Japan Motors ERP** é uma plataforma web completa desenvolvida para a **Japan Motors** — uma revenda de veículos localizada em Goiânia, GO. O sistema centraliza toda a operação da loja: do cadastro de clientes e estoque de veículos até a geração, impressão e gerenciamento de contratos de compra e venda e notas promissórias.

> **Endereço:** Av. Contorno, QD35 - LT 01 - Jardim Colorado, Goiânia - GO, 74474-048

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│         React 19 + Vite 8 + Tailwind 4          │
│                 (porta :5173)                    │
└──────────────────┬──────────────────────────────┘
                   │ HTTP /api/*
                   │ (proxy Vite em dev / Vercel em prod)
┌──────────────────▼──────────────────────────────┐
│                   BACKEND                        │
│              Express.js (REST API)               │
│                 (porta :3001)                    │
│                                                  │
│  /api/customers  │  /api/vehicles                │
│  /api/sales      │  /api/templates               │
└──────────────────┬──────────────────────────────┘
                   │ Prisma ORM + adapter-pg
┌──────────────────▼──────────────────────────────┐
│               BANCO DE DADOS                     │
│         Neon PostgreSQL (Serverless)              │
│         Região: South America (sa-east-1)        │
└─────────────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

### 👥 Gestão de Clientes
- Cadastro completo: Nome, CPF/CNPJ, RG, Órgão Emissor, Nacionalidade, Estado Civil, Profissão
- Dados de contato: Telefone, WhatsApp, E-mail
- Endereço completo: Logradouro, Bairro, Cidade, Estado, CEP
- Busca em tempo real por nome ou CPF
- Edição e exclusão com confirmação

### 🚗 Gestão de Estoque
- Cadastro detalhado do veículo: Marca, Modelo, Ano, Placa, Chassi, Renavam
- Dados técnicos: Cor, Combustível, Câmbio, Quilometragem
- Controle automático de status (**Disponível** → **Vendido**) após a venda
- Filtro por status e busca por modelo/placa
- Preço de venda por veículo

### 💰 Realização de Vendas
- Vinculação de Cliente + Veículo disponível
- Cálculo automático do valor total (Dinheiro + Financiamento)
- Registro de histórico de financiamento (banco, parcelas, etc.)
- Taxas de despachante e TAC configuráveis
- Observações do contrato
- Geração automática de Promissórias com:
  - Quantidade de parcelas configurável
  - Data de vencimento da primeira parcela (demais preenchidas automaticamente)
  - Aplicação de juros com preview em tempo real
  - Datas customizáveis por parcela

### 📄 Contratos de Compra e Venda
- Layout fiel ao modelo original da Japan Motors
- Fontes monoespaçadas (estilo máquina de escrever)
- 4 páginas otimizadas para impressão A4
- Impressão direta pelo navegador (Ctrl+P)
- Dados de comprador e vendedor preenchidos automaticamente
- Cláusulas completas de garantia (90 dias motor e câmbio)
- Modelo de contrato selecionável por venda

### 📜 Notas Promissórias
- Design premium com elementos de segurança visual
- Marca d'água automática com logo da empresa
- Faixa lateral decorativa de autenticidade
- 2 promissórias por folha A4
- Vencimento destacado e número de parcela visível
- Dados completos do emitente (comprador)
- Campo de assinatura formatado

### 🗂️ Modelos de Contrato
- Criação e edição de múltiplos modelos
- Modelo padrão configurável
- Editor de cláusulas livre
- Vinculação por venda

### 📊 Histórico de Vendas
- Listagem completa de todas as vendas
- Busca por cliente, veículo ou data
- Acesso direto ao contrato e promissórias de cada venda
- Dados integrados de cliente e veículo

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React | 19.x |
| Build Tool | Vite | 8.x |
| CSS Framework | Tailwind CSS | 4.x |
| Ícones | Lucide React | Latest |
| Backend | Express.js | 5.x |
| ORM | Prisma | 7.x |
| Banco de Dados | PostgreSQL (Neon) | Serverless |
| Adaptador DB | @prisma/adapter-pg | Latest |
| Deploy | Vercel | - |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Conta no [Neon](https://neon.tech) (gratuita)
- Git

### 1. Clonar o repositório
```bash
git clone https://github.com/joaodiasft/japansmotorsadmin.git
cd japansmotorsadmin
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@host/neondb?sslmode=require"
```

### 4. Sincronizar banco de dados
```bash
npx prisma db push
npx prisma generate
```

### 5. Iniciar o sistema completo
```bash
npm run dev:all
```

Isso inicia simultaneamente:
- 🔵 **Backend (Express):** `http://localhost:3001`
- 🟢 **Frontend (Vite):** `http://localhost:5173`

---

## ☁️ Deploy na Vercel

### Variáveis de Ambiente obrigatórias na Vercel:

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão Neon PostgreSQL |

### Passos:
1. Faça fork/clone do repositório no GitHub
2. No painel da Vercel, importe o projeto
3. Adicione a variável `DATABASE_URL` nas configurações
4. Deploy automático! O `vercel.json` já está configurado

> O comando de build configurado é: `npx prisma generate && npm run build`

---

## 📡 Endpoints da API

### Clientes — `/api/customers`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/customers` | Lista todos os clientes |
| `POST` | `/api/customers` | Cria novo cliente |
| `PUT` | `/api/customers/:id` | Atualiza cliente |
| `DELETE` | `/api/customers/:id` | Exclui cliente |

### Veículos — `/api/vehicles`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/vehicles` | Lista todos os veículos |
| `POST` | `/api/vehicles` | Cadastra novo veículo |
| `PUT` | `/api/vehicles/:id` | Atualiza veículo (inclusive status) |
| `DELETE` | `/api/vehicles/:id` | Exclui veículo |

### Vendas — `/api/sales`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/sales` | Lista todas as vendas (com cliente e veículo) |
| `GET` | `/api/sales/:id` | Detalhe de uma venda |
| `POST` | `/api/sales` | Registra nova venda + marca veículo como vendido |
| `DELETE` | `/api/sales/:id` | Exclui registro de venda |

### Modelos — `/api/templates`
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/templates` | Lista todos os modelos |
| `POST` | `/api/templates` | Cria novo modelo |
| `PUT` | `/api/templates/:id` | Atualiza modelo |
| `DELETE` | `/api/templates/:id` | Exclui modelo |

---

## 🗃️ Modelo de Dados

```prisma
model Customer {
  id            String  @id @default(cuid())
  name          String
  cpf           String  @unique
  rg            String?
  orgaoEmissor  String?
  nacionalidade String?
  estadoCivil   String?
  profissao     String?
  phone         String?
  email         String?
  address       String?
  neighborhood  String?
  city          String?
  state         String?
  cep           String?
  sales         Sale[]
}

model Vehicle {
  id           String  @id @default(cuid())
  brand        String?
  model        String
  year         String?
  color        String?
  plate        String? @unique
  chassis      String? @unique
  renavam      String?
  mileage      String?
  fuelType     String?
  transmission String?
  price        String?
  status       String  @default("available") // available | sold
  sales        Sale[]
}

model Sale {
  id             String   @id @default(cuid())
  saleDate       String
  customerId     String
  vehicleId      String
  totalValue     String
  cashValue      String?
  financedValue  String?
  installments   Int?
  applyInterest  Boolean  @default(false)
  // ... demais campos financeiros
  customer       Customer @relation(...)
  vehicle        Vehicle  @relation(...)
}

model ContractTemplate {
  id        String  @id @default(cuid())
  name      String
  content   String
  isDefault Boolean @default(false)
}
```

---

## 📂 Estrutura do Projeto

```
japansmotorsadmin/
├── api/
│   └── index.js              # Serverless handler (Vercel)
├── server/
│   ├── app.js                # Express app (configuração)
│   ├── index.js              # Servidor local (listen)
│   ├── db.js                 # Prisma Client + adaptador pg
│   └── routes/
│       ├── customers.js      # CRUD Clientes
│       ├── vehicles.js       # CRUD Veículos
│       ├── sales.js          # CRUD Vendas
│       └── templates.js      # CRUD Modelos
├── prisma/
│   └── schema.prisma         # Definição do banco de dados
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Navegação principal
│   │   ├── Home.jsx          # Dashboard inicial
│   │   ├── CustomerManager.jsx
│   │   ├── VehicleManager.jsx
│   │   ├── SaleManager.jsx
│   │   ├── ContractManager.jsx
│   │   ├── PromissoryManager.jsx
│   │   ├── TemplateManager.jsx
│   │   └── History.jsx
│   ├── hooks/
│   │   └── useApi.js         # Utilitário de chamadas HTTP
│   ├── App.jsx               # Componente raiz + estado global
│   └── index.css             # Estilos globais + print CSS
├── vercel.json               # Configuração de deploy
├── vite.config.js            # Proxy + plugins Vite
└── package.json
```

---

## 🧾 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia somente o frontend Vite |
| `npm run server` | Inicia somente o backend Express |
| `npm run dev:all` | ⭐ Inicia **tudo junto** (recomendado) |
| `npm run build` | Gera build de produção |
| `node scripts/test-db.js` | Testa a conexão com o banco |

---

## 🤝 Desenvolvido para

**Japan Motors** — Goiânia, GO  
Av. Contorno, QD35 - LT 01 - Jardim Colorado  
CEP: 74474-048

---

<div align="center">
  <sub>Desenvolvido com ❤️ para simplificar a gestão de revendas de veículos</sub>
</div>
