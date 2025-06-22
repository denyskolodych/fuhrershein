const fs = require('fs');
const http = require('http');
const express = require('express');

const PORT = process.env.PORT || 3000;
 const server = http.createServer((req,res) =>{
    const url = new URL(req.url, `http://${req.headers.host}`);
    switch(url.pathname) {
        case '/':
            if (req.method === 'GET'){
                fs.readFile('datebase.json', 'utf-8', (err, data) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
                        res.end('Server Error');
                        console.error('Error reading file:', err);
                        return;
                    }
                
                    if(url.searchParams.has('1') && !url.searchParams.has('ans-1')  && !url.searchParams.has('ans-2')) {
                         let questions = JSON.parse(data);
                         console.log(questions[0].question);
            
                         res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
                         res.end(questions[0].question)
                         return;
                    }
                    else if (url.searchParams.has('2') && !url.searchParams.has('ans-1') && !url.searchParams.has('ans-2')) {
                        let questions = JSON.parse(data);
                        console.log(questions[1].question);
                        res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
                        res.end(questions[1].question);
                        return;
                    }
                    else if (url.searchParams.has('ans-1')){
                        let answers = JSON.parse(data);
                        console.log(answers[0].answers);
                        res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
                        res.end(JSON.stringify(answers[0].answers));
                        console.log('ans-1');
                        return;
                    }
                    else if (url.searchParams.has('ans-2')) {
                        let answers = JSON.parse(data);
                        console.log(answers[1].answers);
                        res.writeHead(200, {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'});
                        res.end(JSON.stringify(answers[1].answers));
                        console.log('ans-2');
                        return;
                    }
                    
                })
                
                

            }
            else if (req.method === 'POST'){
                req.setEncoding('utf-8')
                let body = '';
                req.on('data',(chunk)=>{
                    body += chunk;
                });
                req.on('end',()=>{
                    fs.readFile('datebase.json', 'utf-8',(err,data)=>{
                        if (err) {
                            res.writeHead(500, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
                            res.end('Server Error');
                            console.error('Error reading file:', err);
                            return;
                        }
                        let questions = JSON.parse(data);
                        console.log('Received body:', body);
                        let body1 = body.split('|');
                        console.log('wqejoijewoip',body1);
                    message = ''
                    
                        console.log('questions:', questions);
                        let body21 = body1[0].split(',');
                        let body22 = body1[1].split(',');
                        console.log('body21:', body21);
                        console.log('body22:', body22);
                    
                        
                        console.log(checkAnswers(body21, questions[0].correctanswer))
                        console.log(checkAnswers(body22, questions[1].correctanswer))
                        let count = 0;
                        function checkAnswers(answers, correctAnswers) {
                            console.log('answers:', answers);
                            console.log('correctAnswers:', correctAnswers);
                            for (let i = 0; i < answers.length; i++) {
                                if (answers.length !== correctAnswers.length) {
                                    return false;
                                }   
                                if (!correctAnswers.includes(answers[i])) {
                                    return false;
                                }
                                return true;
                            }
                        }
                        
                        if (checkAnswers(body21, questions[0].correctanswer)) {
                            
                            message = 'Вітаємо вас, ви відповіли правильно на перше питання<br>';
                            count++;
                     } 
                        else {
                            message = 'На жаль, ви відповіли неправильно на перше питання<br>';
                        }
                        if (checkAnswers(body22, questions[1].correctanswer)) {
                            message += 'Ви відповіли правильно на друге питання!';
                            count++;
                        } 
                        else {
                            message += 'Ви відповіли неправильно на друге питання.';
                        }
                        if(count === 2){
                            message = 'Вітаємо, ви відповіли правильно на обидва питання!';
                        }
                        else if (count === 0){
                            message = 'На жаль, ви відповіли неправильно на обидва питання.';
                        }
                        
                        res.writeHead(200,{'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'})
                        res.end(message);
                        });
                    })
                    return ;
                
            }
            

                
                break;
         default:
                res.writeHead(404, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
                res.end('Not Found');
                break;
    }
 })


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
