# Bilisco Wi-Fi Portal

Portal captive para a rede de visitantes do Bilisco.

## Fluxo esperado

1. Cliente conecta no SSID BILISCO.
2. MikroTik Hotspot redireciona para o portal, passando os parâmetros do cliente.
3. O formulário coleta nome, sobrenome, celular e aceite.
4. O front envia os dados para `POST /api/cadastro`.
5. O backend salva o lead e autoriza o dispositivo na RB.
6. O backend responde com `{"redirectUrl":"..."}`.
7. O navegador segue para a URL e o cliente navega normalmente.

## Parâmetros aceitos da RB

- `mac`
- `ip`
- `link-login`
- `link-login-only`
- `link-orig`
- `chap-id`
- `chap-challenge`

## Próxima etapa

Publicar este diretório em `bilisco.mystech.com.br`, criar o endpoint `/api/cadastro` e integrar a autorização com o MikroTik.
