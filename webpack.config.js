const path = require('path');

module.exports = {
    entry: './src/index.js', // Arquivo de entrada
    output: {
        path: path.resolve(__dirname, 'dist'), // Pasta de saída
        filename: 'bundle.js', // Nome do arquivo gerado
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Processar arquivos CSS
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.js$/, // Processar arquivos JavaScript
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'), // Configuração para servir arquivos estáticos
        port: 3000, // Porta para o servidor
        setupMiddlewares: (middlewares, devServer) => {
            console.log('Servidor iniciado em http://localhost:3000');
            return middlewares;
        },
    },
};
