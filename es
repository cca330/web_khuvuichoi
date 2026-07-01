name: Deploy to Linux

on:
  push:
    branches:
      - main

jobs:
  deploy:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout
        uses: actions/checkout@v4

      - name: SSH Deploy

        uses: appleboy/ssh-action@v1.2.2

        with:

          host: ${{ secrets.SERVER_HOST }}

          username: ${{ secrets.SERVER_USER }}

          key: ${{ secrets.SERVER_SSH_KEY }}

          script: |

            cd ${{ secrets.PROJECT_PATH }}

            git pull

            docker compose up -d --build
