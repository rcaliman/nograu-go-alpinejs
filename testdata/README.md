# Dados de teste

`chat-app-java.bin` contém uma lista serializada pelo sistema anterior
(`java.util.ArrayList<String>`), com referência repetida, Unicode, NUL e null.

Os testes Go usam esse arquivo para verificar a compatibilidade com os registros
existentes em `contacts.chat_app`. Nenhum compilador ou runtime Java é necessário.
