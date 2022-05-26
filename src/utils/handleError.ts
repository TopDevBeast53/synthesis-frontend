export default(err,toastError?)=>{
    let errMsg = "Unknown Error"
    console.log("handleError======", err)
    if(err.code === 4001){
        errMsg = err.message
    }
    if(toastError) toastError("Error", errMsg)
    return errMsg
}