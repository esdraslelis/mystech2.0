# Bilisco Wi-Fi Portal

Portal captive + painel administrativo do Wi-Fi Bilisco.

## Arquitetura

- Frontend: arquivos estáticos em `bilisco-portal/`
- Hospedagem: Cloudflare Pages conectado ao GitHub
- Backend: Supabase Edge Functions
- Banco: Supabase Postgres
- Portal: `https://bilisco.mystech.com.br/`
- Painel: `https://bilisco.mystech.com.br/admin/`

## Fluxo

1. Cliente conecta no SSID BILISCO.
2. MikroTik Hotspot redireciona para `bilisco.mystech.com.br`, passando MAC, IP e URLs do Hotspot.
3. O cliente informa nome, sobrenome e celular e aceita os termos.
4. O frontend envia o cadastro para a Edge Function `register-lead`.
5. O lead é salvo no Supabase.
6. O frontend envia o cliente para o login Trial do MikroTik usando `T-<MAC>`.
7. O acesso é liberado conforme o perfil Trial configurado na RB.
8. O admin acompanha os leads pelo painel protegido.

## Backend Supabase

Projeto: `bilisco-wifi`

Edge Functions:
- `register-lead` — cadastro público validado
- `bilisco-admin` — login, sessão, leads e logout

Tabela principal:
- `public.bilisco_leads`

O acesso administrativo usa credencial armazenada com salt + hash, e sessões temporárias de 12 horas.

## Cloudflare Pages

Conectar o repositório:
- Repository: `esdraslelis/mystech2.0`
- Production branch: `bilisco-portal`
- Framework preset: None
- Root directory: `bilisco-portal`
- Build command: deixar vazio
- Build output directory: `.`

Depois adicionar o domínio:
- `bilisco.mystech.com.br`

## MikroTik

O Hotspot deve enviar ao portal:
- `mac`
- `ip`
- `link-login-only`
- `link-orig`

O perfil do Hotspot precisa ter Trial habilitado para o fluxo `T-<MAC>`.

Também é necessário liberar no Walled Garden, antes do login:
- `bilisco.mystech.com.br`
- `ilccoqqhgrsqgbglyiha.supabase.co`
