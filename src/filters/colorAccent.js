export default (arr) => {
    if(arr.length > 1) {
        return 'grey lighten-1'
    } else if (arr.length == 1){
        return `${arr[0]} lighten-1`
    }else{
        return 'white'
    }
}