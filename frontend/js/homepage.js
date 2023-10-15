const createNewRoom = async () => {
    //1. Send a request to the server to create a new room

    try {
        const createRoomResponse = await fetch('http://localhost:3000/room/create', {
            method: 'POST'
        });

        const createRoomResponseBody = await createRoomResponse.json();

        const {roomId, playerId, playerLetter } = createRoomResponseBody;
        
        const newRoom = `http://localhost:3000/room/${roomId}?playerId=${playerId}&roomId=${roomId}&playerLetter=${playerLetter}`;

        window.location.href = newRoom;

        console.log(createRoomResponseBody); 
    } catch(err) {
        console.log(err);
    }


    //2. Get the response which should include the playerId, playerLetter, roomId

    //3. Redirect the current user to the roomId
}

const joinExistingRoom = async () => {
    const roomIdInput = document.getElementById('roomIdInput');
    const roomId = roomIdInput.value;
    
    if(roomId) {
        try {
            const joinRoomResponse = await fetch(`http://localhost:3000/room/join/${roomId}`, {
                method: 'POST'
            });

            const joinRoomResponseBody = await joinRoomResponse.json();
    
            const { playerId, playerLetter } = joinRoomResponseBody;
            
            const newRoom = `http://localhost:3000/room/${roomId}?playerId=${playerId}&roomId=${roomId}&playerLetter=${playerLetter}`;
            
            if(joinRoomResponse.ok) {
                window.location.href = newRoom;
            }
            else {
                alert(`Can not join room ${roomId}. An error occured.`);
            }
            
        } catch(err) {
            console.log(err)
        }

        
    }
}