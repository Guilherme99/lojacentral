# Sistema de gerência de convites

# Sobre
Esta aplicação está desenvolvida em:
1. React v18 - Front-end
2. Java Spring Boot v3.1.2 - Back-end
3. Redis - Serviço de sessões
4. Python - Serviço de mapeamento de presets
5. PostgresSQL v16- Banco de dados
   
## 💻 Pré-requisitos

### Docker

Dependendo do seu sistema operacional, você tem 2 opções para instalar o Docker:

- [Docker Desktop] - Interface gráfica para gerenciar e usar o Docker.
- [Docker Engine] - Apenas a engine do Docker, sem interface gráfica, chamado de Docker Nativo.

Particularmente, usei o Docker sem interface gráfica, na versão 27.3.1.

## 🚀 Rodando o projeto

### Clone o repositório:

```
  git clone https://github.com/Guilherme99/lojacentral.git
```
### Configurar o volume dos serviços: postgres, redis
Servirá para em caso de perda de container, os dados permanecerão salvos. O arquivo para configuração é: docker/docker-compose.yaml

### Rodar os serviços
Esses serviços serão criados a partir do docker-compose.yaml, em docker/docker-compose.yaml. Para rodá-los, basta executar:

```
  docker-compose -f docker-compose.yaml up -d --build
```

Executar o seguinte comando abaixo para ver se os serviços foram criados:
```
  docker ps
```

### ☕ Acessar a aplicação

Para isso, será necessário acessar pelo navegador em:
```
  http://localhost:4300
```

Usuário: admin@gmail.com
Senha: senha123

## 📫 Contribuindo para o projeto
<!---Se o seu README for longo ou se você tiver algum processo ou etapas específicas que deseja que os contribuidores sigam, considere a criação de um arquivo CONTRIBUTING.md separado--->
Para contribuir, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin <nome_do_projeto> / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 📝 Licença

Esse projeto está sob licença.

[⬆ Voltar ao topo](#nome-do-projeto)<br>
