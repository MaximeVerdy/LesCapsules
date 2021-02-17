
export default function(token = 'TokenTest01', action){


    if(action.type == 'addToken'){
        return action.token
        
    } else {
        return token
    }

}

