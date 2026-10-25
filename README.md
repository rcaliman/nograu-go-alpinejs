# No Grau em Go

Servidor em Go com MySQL e páginas Alpine.js para Bikefit, mural, calculadora de empréstimos e Tagpet. A base Java e os arquivos Maven foram removidos; a compatibilidade com o banco e as URLs existentes foi preservada.

O executável inclui HTML, JavaScript, CSS, imagens e dados de fuso horário. Não exige Java, Go, Node nem arquivos do site no Raspberry. O MySQL continua sendo necessário. SMTP e a atualização diária do cadastro de bancos pelo Banco Central usam a rede.

## Organização

- `*.go`: servidor HTTP, módulos de negócio, configuração e testes.
- `web/static/`: páginas, scripts, estilos e imagens incorporados ao executável.
- `web/i18n/`: traduções incorporadas ao executável.
- `deploy/`: exemplos de configuração e serviço systemd.
- `testdata/`: dados para testes de compatibilidade com o banco existente.
- `dist/`: executáveis gerados, ignorados pelo Git.

## Desenvolvimento local

Instale Go 1.23 ou superior e disponibilize um MySQL com o schema existente
(descrito abaixo). Configure o ambiente usando `deploy/nograu.env.example` como
referência ou um `application.properties` local. Depois execute:

```sh
go run .
```

Configurações locais, credenciais, arquivos de IDE e binários são ignorados pelo
Git. Os exemplos em `deploy/` devem conter apenas valores fictícios.
As chaves `spring.*` continuam aceitas para compatibilidade de configuração.

## Compilar

Com Go 1.23 ou superior, na raiz do projeto:

```sh
make test
make raspberry
```

Os executáveis ficam em `dist/`:

| `uname -m` no Raspberry | Executável |
| --- | --- |
| `aarch64` | `nograu-linux-arm64` |
| `armv7l` | `nograu-linux-armv7` |

Ambos são compilados com `CGO_ENABLED=0`, sem dependência de uma versão específica de glibc. Para compilar para o computador atual: `make build`.

## Rodar com a configuração existente

Copie o executável correto para o Raspberry e mantenha as configurações efetivas do Spring em um arquivo **externo**:

```sh
chmod +x ./nograu
NOGRAU_CONFIG=/caminho/application.properties TZ=America/Sao_Paulo ./nograu
```

Para testar em outra porta, mantendo o Spring na 8080:

```sh
NOGRAU_CONFIG=/caminho/application.properties TZ=America/Sao_Paulo ./nograu -port 9090
```

Acesse `http://IP-DO-RASPBERRY:9090`. A opção `-port` (ou `--port`) prevalece sobre `HTTP_ADDR` e `server.port`; sem ela, a configuração anterior continua valendo. Use `./nograu -help` para ver as opções. Para que os links enviados por e-mail também apontem para o ambiente de teste, configure `NOGRAU_BASE_URL=http://IP-DO-RASPBERRY:9090`.

O arquivo aceita as propriedades simples `chave=valor` de conexão (`spring.datasource.*`), SMTP (`spring.mail.*`), `server.port`, `nograu.base-url` e `nograu.mail.from`. Se não indicar um caminho, lê `application.properties` do diretório atual, se existir. O parser não interpreta perfis Spring, placeholders `${...}`, YAML ou arquivos do interior do JAR; use os valores resolvidos ou variáveis de ambiente. O arquivo local de configuração não é incorporado ao executável nem deve ser versionado.

Alternativamente, configure variáveis de ambiente conforme [deploy/nograu.env.example](deploy/nograu.env.example). Variáveis têm precedência sobre o arquivo. `MYSQL_DSN` substitui a configuração JDBC; `HTTP_ADDR` substitui a porta. Sem configuração, tenta `localhost:3306/db_nograu`, usuário `root`, senha vazia e HTTP em `:8080`. Sem host SMTP, registra no log que as notificações não foram enviadas.

Mantenha `TZ` igual ao fuso usado pela JVM anterior para preservar a interpretação dos campos `DATETIME` existentes. A contagem diária de empréstimos continua usando o dia de São Paulo. `NOGRAU_BASE_URL` deve conter a URL pública para os links de edição enviados por e-mail.

## Banco existente

Não há criação de tabelas, migração ou `ALTER TABLE` automático. Na inicialização, o Go consulta `information_schema` e verifica as tabelas e colunas utilizadas:

- `tb_bikefit`, `tb_mensagem`, `tb_mensagem_like`;
- `tb_banco`, `tb_calculo_emprestimo`;
- `pets`, `contacts`.

Os UUIDs mantêm o armazenamento existente (`BINARY`/`VARBINARY` ou `CHAR`/`VARCHAR`). `contacts.chat_app` aceita JSON e a serialização `java.util.ArrayList<String>` usada por versões anteriores do Hibernate; a escrita segue o tipo da coluna. O segredo dos links Tagpet existentes é calculado a partir de `created_at`, preservando a formatação de `LocalDateTime.toString()` do Java.

A aplicação interrompe a inicialização se faltar uma tabela/coluna ou encontrar um tipo incompatível. Se o Spring instalado estiver em uma revisão anterior que não tem `tb_mensagem_like`, será necessário avaliar esse schema antes da troca. Não crie tabelas por tentativa no banco de produção.

Os cálculos de Bikefit mantêm as fórmulas anteriores. A calculadora de empréstimos mantém entrada em centavos, taxa mensal em percentual na resposta e saldo devedor positivo na resposta/negativo no banco; o cálculo da taxa também trata juros zero. Atualizações do cadastro de bancos só substituem os registros depois que o CSV foi baixado e validado, dentro de uma transação.

## Instalar como serviço Debian

Primeiro teste em uma **cópia do banco**, incluindo leitura dos registros antigos, criação dos três módulos, links antigos de edição Tagpet, likes e e-mails. Os testes locais não substituem essa verificação com o schema e os dados reais do Raspberry.

Exemplo de instalação, ajustando os nomes dos arquivos e do serviço Spring:

```sh
sudo useradd --system --home-dir /opt/nograu --shell /usr/sbin/nologin nograu
sudo install -d /opt/nograu /etc/nograu
sudo install -m 755 nograu-linux-arm64 /opt/nograu/nograu
sudo install -m 600 deploy/nograu.env.example /etc/nograu/nograu.env
sudoedit /etc/nograu/nograu.env
sudo install -m 644 deploy/nograu.service /etc/systemd/system/nograu.service
sudo systemctl daemon-reload
```

O arquivo de ambiente é lido pelo systemd; não precisa ser legível pelo usuário do serviço. Se usar `NOGRAU_CONFIG`, garanta que o usuário `nograu` consiga ler o arquivo e que seu caminho não esteja em `/home`, bloqueado pela proteção do serviço de exemplo.

Após fazer backup do MySQL e validar a cópia:

1. Pare o serviço Spring atual para liberar a porta 8080.
2. Execute `sudo systemctl enable --now nograu`.
3. Confira `sudo journalctl -u nograu -f` e teste as páginas e APIs pela URL pública.

O proxy reverso pode continuar apontando para a mesma porta. Para retornar, pare `nograu` e inicie o serviço Spring anterior. As gravações normais das APIs permanecem no mesmo banco; a versão Go não altera sua estrutura.

## Verificação

`go test ./...` cobre contratos HTTP, validação, fórmulas financeiras, UUID binário, paginação, transações de likes/pets e serialização Java com fixtures. Os testes SQL usam um banco simulado; nenhum teste conecta automaticamente à produção. `go vet ./...` verifica problemas estáticos.

## Diagnosticar notificações por e-mail

Na inicialização, o log informa host/porta SMTP, STARTTLS e se autenticação/senha estão configuradas, sem imprimir a senha. Após cada tentativa registra a falha ou que o servidor SMTP aceitou a notificação (isso não comprova entrega na caixa de entrada).

Para Gmail com autenticação por senha, use `smtp.gmail.com`, porta `587`, STARTTLS e uma senha de app da conta correspondente a `spring.mail.username`. O erro `534 5.7.9 WebLoginRequired` indica recusa de autenticação pelo Google. Confira a conta no navegador e configure uma senha de app válida em `spring.mail.password`/`SPRING_MAIL_PASSWORD`; reinicie o processo após alterar a configuração. A criação de senhas de app exige verificação em duas etapas e pode ser restrita pela política da conta. Consulte a [orientação oficial do Google](https://support.google.com/accounts/answer/185833?hl=pt-BR).

O mural envia a notificação para o e-mail da mensagem original quando a resposta contém `idResposta`. O backend também aceita esse identificador na query string para páginas antigas em cache. E-mails que falharam anteriormente não são reenviados automaticamente.

## Enviar pelo Resend

O executável já suporta [SMTP do Resend](https://resend.com/docs/send-with-smtp). Não é necessário adicionar SDK, mudar o banco ou recompilar para trocar o provedor. Os e-mails de pets e respostas do mural usam a mesma configuração.

1. Em [Domains](https://resend.com/domains), verifique o domínio `nograu.com.br` para usar o remetente escolhido, `No Grau <nograu@nograu.com.br>`. Cadastre no provedor DNS os registros exatos exibidos pelo Resend e aguarde o status verificado. O remetente deve pertencer ao domínio verificado; não use `@gmail.com`. Consulte [adicionar e verificar domínio](https://resend.com/docs/add-a-domain).
2. Crie uma chave com permissão de envio restrita ao domínio em [API Keys](https://resend.com/api-keys). Revogue qualquer chave compartilhada em chats. Não grave a chave no código, nos exemplos ou nos binários.
3. Mescle [deploy/resend-mail.properties.example](deploy/resend-mail.properties.example) ao `application.properties` externo do Raspberry. O remetente está definido como `No Grau <nograu@nograu.com.br>`; preserve as propriedades de conexão MySQL.
4. A chave é a senha SMTP. Configure `SPRING_MAIL_PASSWORD` no ambiente do processo ou no arquivo protegido do serviço systemd. Alternativamente, use `spring.mail.password` apenas no arquivo externo protegido. `RESEND_API_KEY` não é lido pelo executável: como a integração usa SMTP, a variável é `SPRING_MAIL_PASSWORD`.

Para testar em um terminal Bash no Raspberry sem colocar a chave no histórico de comandos:

```sh
read -rsp 'Nova chave de envio do Resend: ' SPRING_MAIL_PASSWORD
printf '\n'
export SPRING_MAIL_PASSWORD
NOGRAU_CONFIG=/caminho/application.properties ./nograu -port 5001
```

O log inicial deve mostrar `servidor=smtp.resend.com porta=587 STARTTLS=true autenticação=true senha_configurada=true`. Cadastre um pet com seu próprio e-mail e responda a uma mensagem sua no mural. Confira os logs do processo e o estado de cada envio em [Emails](https://resend.com/emails). A aceitação SMTP não garante entrega na caixa de entrada. Notificações que já falharam não são reenviadas automaticamente.

Verificar o domínio, configurar a chave no servidor e confirmar entrega são etapas externas; criar o arquivo de exemplo não as executa. O token não está incluído no projeto.

## Enviar ao Git

Depois de validar com `make test` e `make build`, revise e envie as alterações:

```sh
git status --short
git add -A
git diff --cached --stat
git diff --cached --check
git commit -m "Remove base Java e organiza aplicação Go"
git push
```

A remoção dos arquivos não apaga versões anteriores do histórico Git.
