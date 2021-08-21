const app = require('express')();
const http = require('http').Server(app);
const socketio = require('socket.io')(http);
const readline = require('readline');
const path = require('path');
const express = require('express');

//Connect to dist after build
app.use(express.static(path.join(__dirname, '/dist/socket-app/')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/socket-app/src/index.html'));
});

//holds documents with doc.id
const documents = {};
//holds chat messages
const messages = [];
//holds connect sockets, used to disconnect sockets when server closes
var socketlist = [];

socketio.on('connection', socket => {
    console.log(`Socket ${socket.id} has connected safely. No errors found.`);
    //add socket to socketlist
    socketlist.push(socket);
    //id for previous doc when user leaves a document
    let prevID;

    //joinSafe allows for safe changing between sockets
    const joinSafe = currID => {
        //socket leaves the last doc
        socket.leave(prevID);
        //join new room
        socket.join(currID, () => console.log(`Socket ${socket.id} has just safely joined doc ${currID}. Welcome!`));
        prevID = currID;
    }

    //Handles adding document from client side
    socket.on('addDoc', doc => {
        //adds doc from client to documents object
        documents[doc.id] = doc;
        //safe join doc with id doc.id
        joinSafe(doc.id);
        //update documents object for all sockets
        socketio.emit('documents', Object.keys(documents));
        //emit back to this socket the doc they created
        socket.emit('document', doc);
    });

    //Handles switching to an already created 
    socket.on('getDoc', docID => {
        //safe join doc with id doc.id
        joinSafe(docID);
        // emit document to socket who wants to join
        socket.emit('document', documents[docID]);
    });

    //edit / type in document // Basically adds what has been written to the document
    socket.on('editDoc', doc => {
        //updates doc in documents object
        documents[doc.id] = doc;
        //send updated document to specific doc (room)
        socket.to(doc.id).emit('document', doc);
    });

    //new chat message
    socket.on('newMessage', (message) => {
        //add message to messagees array
        messages.push(message);
        //send message to all sockets (reverse is so newest messages show up on top)
        socketio.emit('messages', messages.reverse());
    });

    //emit messages and documents on connection (before any actions are taken)
    socketio.emit('messages', messages.reverse());
    socketio.emit('documents', Object.keys(documents));
    //when client closes browser, socket gets closed
    socket.on('close', function() {
        console.log(`Socket${socket.id} closed`);
        socket.close();
    });

});
//readline question for closing server
function closeServer(question){
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(result =>
        rl.question(question, answer => {
            if (answer === "close")
                rl.close();
            result(answer);
        }));
}
//port 4200
http.listen(4200, async () => {
    console.log('Listening on port 4200');

    const answer = await closeServer("Type close to close server: ");
    //if usr types close enter
    if (answer === "close"){
        //for every socket
        socketlist.forEach(function(socket) {
            //message for client
            const mess = "NO CONNECTION : Server has been terminated";
            //tell client server is closing
            socket.emit('closing', mess);
            console.log(`Socket ${socket.id} has been disconnected`);
            //disconnect each socket
            socket.disconnect(true);
        });

        console.log("closing server");
        //close server
        process.exit();
    }
});
