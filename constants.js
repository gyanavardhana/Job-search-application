const cons = {
    "ok": 200,
    "created": 201,
    "badrequest": 400,
    "unauthorized": 401,
    "forbidden": 403,
    "notfound": 404,
    "conflict": 409,
    "internalerror": 500,
    'mongoerror': 11000,
    'userexists': "User already exists",
    "nouser": "User not found",
    "wrongpass": "Wrong Password",
    "invalidLogin": "Invalid Login",
    "success": "Login Successful",
    "applieddone": "Job already APPLIED",
    "applysuccess": "Job APPLIED Successfully",
    "withdrawsuccess": "Job WITHDRAWN Successfully",
    "notapplied": "Job not APPLIED",
}

module.exports = cons;