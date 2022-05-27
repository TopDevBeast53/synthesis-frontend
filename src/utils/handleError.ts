export default(err,toastError?)=>{
    let errMsg = "Unknown Error"    
    if(err.code === 4001){
        errMsg = err.message
    }
    if(toastError) toastError("Error", errMsg)
    return errMsg
}