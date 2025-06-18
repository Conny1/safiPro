
  const createError = (status, message)=>{
    let err = new Error()
  
    err.status = status || 500
    err.message = message || "Server error: Something went wrong."
  
    return err
}

module.exports ={
    createError
}