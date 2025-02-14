# MVP 2 - UFSPet
## Feito por
- Luis Felipi Cruz de Souza [@LuisFSouza](https://github.com/LuisFSouza)
- Ryan de Melo Andrade [@MasteryRyge](https://github.com/MasteryRyge)
- Laura Rieko Marçal Imai [@LauraImai](https://github.com/LauraImai)
- Giovana Maciel dos Santos [@GiovanaMaciel](https://github.com/GiovanaMaciel)

## Setup do Projeto
### Pré-requisitos
Antes de executar o projeto, siga os seguintes passos:

1. **node js**: Certifique que você tem instalado o node. Caso não tenha, [clique aqui](https://nodejs.org/pt). A versão recomendada é a 20.18.1, a que estamos utilizando. 
1. **postgresql**: Certifique que você tem instalado o postgresql. Caso não tenha, [clique aqui](https://www.postgresql.org/).

### Execução do Projeto
Para executar o projeto, siga os seguintes passos:

1. **Clone o repositório**: Clone este repositório em sua máquina local utilizando o Git
```
git clone https://github.com/LuisFSouza/ufspet-mvp1.git
```

2. **Banco de dados**: Crie um banco de dados no postgresql.

3. **Backend**: Abra o terminal na pasta do projeto chamada backend

    3.1. **Instale as dependências**: Instale as dependências do backend
    ```
    npm install
    ```
    3.2. **.env**: Crie um arquivo chamado `.env`, que deverá conter a URL da conexão com o banco de dados, como mostrado abaixo. Onde está escrito USER, PASSWORD, HOST, PORT e DATABASE você preenche com as respectivas informações, sendo que DATABASE será o nome do banco de dados que você criou anteriormente. Se tiver dúvidas do que significa cada informação, consulte a guia 'Connection details' neste [link](https://www.prisma.io/docs/orm/overview/databases/postgresql)
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```
    3.3. **Crie as tabelas no banco de dados**: Rode as migrations para criar as tabelas no banco de dados
    ```
    npx prisma migrate dev
    ```
    3.4. **Realizar testes**: Para executar os testes do backend, digite o seguinte comando.
    ```
    npm test
    ```
    3.5. **Inicie o servidor**
    ```
    npm run start:dev
    ```

4. **Frontend**: Abra o terminal na pasta do projeto chamada frontend

    4.1. **Instale as dependências**: Instale as dependências do frontend
    ```
    npm install --legacy-peer-deps
    ```
    4.2. **Realizar testes**: Para executar os testes do frontend, digite o seguinte comando.
    ```
    npm test
    ```
    4.3. **Inicie o frontend**
    ```
    npm run start
    ```

### Observações
Caso de algum erro, tente atualizar sua versão do node para a recomendada acima, e tente atualizar seu npm usando `npm install -g npm@latest`.

# 🐶😺Pet UFSCar - Treinamento e Capacitação
Este manual foi desenvolvido para ajudar você a compreender e utilizar todas as funcionalidades do sistema Pet UFSCar, garantindo que a gestão do seu pet shop seja eficiente, organizada e intuitiva. Nosso objetivo é proporcionar um **guia de treinamento e capacitação**, permitindo que o funcionário, independentemente do nível de familiaridade com tecnologia, consiga navegar pelo sistema e realizar suas tarefas de forma simples e produtiva.

Se você é um novo funcionário ou alguém que já utiliza o sistema, este guia servirá como um **recurso de apoio** para que você possa aproveitar ao máximo todas as ferramentas disponíveis.

## 📌Introdução
O sistema Pet UFSCar é uma aplicação web desenvolvida para otimizar a gestão de um pet shop, permitindo o gerenciamento de produtos, vendas, agendamentos, serviços, clientes e estoque. Dessa forma, a interface facilita o controle das operações diárias do estabelecimento.

## 🧐Como usar?
* **Acesse o sistema** pelo navegador utilizando o link fornecido pelo administrador;
*  **Navegue entre as seções** para acessar os diferentes módulos do sistema;
* **Utilize os botões de ação** "Visualizar", "Editar", "Excluir", "Novo" e "Compras" (este último apenas na seção "Clientes") para gerenciar os dados conforme necessário;
* **Monitore o estoque** na seção correspondente e reponha produtos conforme os alertas exibidos;
* **Gere relatórios** para acompanhar o desempenho das vendas e identificar necessidades de melhoria.


## 🗃️Estrutura do Sistema
A aplicação possui seis seções onde o usuário pode interagir e gerenciar diferentes aspectos do pet shop. Abaixo, você encontra instruções detalhadas sobre como utilizar cada uma delas:

### 1️⃣ **Produtos**
Gerencie todos os produtos que seu pet shop possui.

**Como usar:**
1. Para remover um produto, selecione o produto e clique no botão **"Excluir"**. Logo após, você deverá confirmar a exclusão.
2. Para visualizar detalhes de um produto, selecione o produto e em seguida clique no botão **"Visualizar"** para analisar seus dados.
3. Para editar um produto existente, selecione o produto e em seguida clique no botão **"Editar"**, modifique os dados desejados e clique em **"Editar"** para salvar.
4. Para adicionar um novo produto, clique no botão **"Novo"**, preencha os campos obrigatórios (Nome, Marca, Preço, Quantidade e Fornecedor) e clique em **"Cadastrar"**.

---

### 2️⃣ **Vendas**
Gerencie todas as vendas realizadas no pet shop.

**Como usar:**
1. Para remover uma venda do sistema, selecione a venda e em seguida clique no botão **"Excluir"**. Após isso, você deverá confirmar a exclusão.
2. Para visualizar detalhes de uma venda, selecione a venda e em seguida clique no botão **"Visualizar"** para analisar seus dados.
3. Para modificar uma venda existente, selecione a venda e em seguida clique no botão **"Editar"**, faça as alterações necessárias e clique em **"Editar"** para salvar.
4. Para registrar uma nova venda, clique em **"Novo"**, informe o cliente, a data da venda, a forma de pagamento, os produtos e suas respectivas quantidades. Depois, clique em **"Cadastrar"**.

---

### 3️⃣ **Agendamentos**
Gerencie os serviços agendados pelos clientes.

**Como usar:**
1. Para remover um agendamento, selecione o agendamento e clique em **"Excluir"**. Logo após, você deverá confirmar a exclusão.
2. Para verificar detalhes de um agendamento, selecione o agendamento e clique no botão **"Visualizar"** para analisar seus dados.
3. Para modificar um agendamento, selecione o agendamento e clique em **"Editar"**, modifique os dados e clique em **"Editar"** para salvar.
4. Para criar um novo agendamento, clique em **"Novo"**, selecione o cliente, o serviço desejado, a data, a forma de pagamento e o status do agendamento (Pendente, Cancelado, Concluído). Depois, clique em **"Cadastrar"**.

---

### 4️⃣ **Serviços**
Gerencie os serviços oferecidos pelo pet shop.

**Como usar:**
1. Para remover um serviço, selecione o serviço e clique em **"Excluir"**. Após isso, você deverá confirmar a exclusão.
2. Para visualizar um serviço cadastrado, selecione o serviço e clique em **"Visualizar"** para analisar seus dados.
3. Para editar um serviço, selecione o serviço e clique em **"Editar"**, modifique as informações e clique em **"Editar"** para salvar.
4. Para adicionar um novo serviço, clique no botão **"Novo"**, preencha os campos (Nome, Duração, Preço, Descrição) e clique em **"Cadastrar"**.

---

### 5️⃣ **Clientes**
Gerencie os dados dos clientes do pet shop.

**Como usar:**
1. Para consultar o histórico de compras de um cliente, selecione o cliente e clique em **"Compras"**. Em seguida, você deverá selecionar uma compra, e clicar em **"Visualizar"** para ver as informações da compra.
2. Para excluir um cliente do sistema, selecione o cliente e clique em **"Excluir"**. Logo após, você deverá confirmar a exclusão.
3. Para visualizar as informações de um cliente, selecione o cliente e clique em **"Visualizar"** para analisar seus dados.
4. Para editar os dados de um cliente, selecione o cliente e clique em **"Editar"**, faça as alterações desejadas e clique em **"Editar"** para salvar.
5. Para cadastrar um novo cliente, clique em **"Novo"**, preencha os dados (Nome, CPF, Email, Telefone, Endereço) e clique em **"Cadastrar"**.

---

### 6️⃣ **Estoque**
Monitore os produtos cadastrados com baixo estoque.

**Como usar:**
1. Para visualizar os produtos com baixa quantidade (menor que 10 unidades), acesse a seção **"Estoque"**.
2. Caso um produto esteja com estoque baixo ou esgotado, reponha a quantidade acessando a seção **"Produtos"** e adicione mais itens.

---

### 7️⃣ **Relatório de Vendas**
Acesse relatórios detalhados sobre as vendas do pet shop diretamente pela tela inicial.

**Como usar:**
1. Para visualizar o relatório de vendas, clique na **logo** da Pet UFSCar, localizada no topo da tela.
2. O relatório exibirá informações importantes, como receita total, quantidade vendida e receita anual.
3. Para baixar uma cópia do relatório, clique no botão **"Baixar"**, e o download do arquivo será iniciado automaticamente.

Utilize os relatórios para acompanhar o desempenho financeiro do pet shop e tomar decisões estratégicas de forma eficiente! 

---

## 🔧Suporte
Caso tenha dúvidas ou precise de suporte técnico, entre em contato com nossa equipe.

✉️ **Email:** suporte.petufscar@gmail.com


