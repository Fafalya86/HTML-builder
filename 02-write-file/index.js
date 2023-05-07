const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const outputFile = path.join(__dirname, 'output.txt');

function onInput(input) {
    if (input.trim().toLowerCase() === 'exit') {
        console.log('До свидания!');
        rl.close();
        return;
    }

    fs.appendFile(outputFile, input + '\n', (error) => {
        if (error) {
            console.error('Произошла ошибка при записи файла:', error.message);
        } else {
            console.log('Текст добавлен в файл:', outputFile);
        }
    });
}

console.log('Введите текст, который нужно записать в файл (для выхода введите "exit" или нажмите Ctrl + C):');
rl.on('line', onInput);