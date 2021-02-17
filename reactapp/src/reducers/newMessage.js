
export default function(newMessage = false, action){

    if(action.type == 'changeStatus'){
        return action.newMessage
        
    } else {
        return newMessage
    }

}

