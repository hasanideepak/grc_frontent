const AIR_MSG = {
    //form succes msg type 0 = custom msg,type 1= msg layout 1
    form_success: (customMsg = '',[...params]) => {
        let formMethod = params[0] ? params[0] : 'get',type = params[1] ? params[1] : 0
        let methodType = formMethod == 'get' ? 'fetched' : (formMethod == 'add' ? 'added' : (formMethod == 'update' ? 'updated' : 'deleted'))
        return type == 0  ? `${customMsg} ${methodType} successfully` : `${customMsg}`
    },
    form_err: (customMsg = '',[...params]) => {
        let type = params[0] ? params[0] : 1,formMethod = params[1] ? params[1] : 'get'
        let methodType = formMethod == 'get' ? 'fetch' : (formMethod == 'add' ? 'add' : (formMethod == 'update' ? 'update' : 'delete'))
        return type == 0  ? `${customMsg} ${methodType} request failed` : `Something Went Wrong!`
    },
    // Add new Project Errors
    project_name_required: "Project name is required *",
    account_required: "Account name is required *",

}

export default AIR_MSG