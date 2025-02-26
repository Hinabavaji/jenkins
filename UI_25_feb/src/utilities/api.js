import moment from "moment"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const TIME = (moment().format()).slice(0, 19);
const TwelveHrs = (moment().subtract(12, 'hours').format()).slice(0,19);

//LOGIN 
export const Login_URL =  BASE_URL +'auth/login/'

//SIGNUP 
export const SIGNUP_URL = BASE_URL + 'auth/signup/'

//LOGOUT
export const LOGOUT_URL = BASE_URL + 'auth/logout/'


//DEVICE CONFIG

export const ADDDEVICE = BASE_URL + 'hosts/'
export const ADD_SBC = BASE_URL + 'sbcs/'
export const SBC_DROPDOWN = BASE_URL + 'sbc_info/'
export const DEVICE_DLT = BASE_URL + 'hosts/'
export const SBCDETAILS = BASE_URL +'sbcs/'


//Threshold

export const THRESHOLDDLT = BASE_URL +'clear_parameter_values/'
export const THRESHOLDUPDATE = BASE_URL +'update_parameter/'
export const THRESHOLDLIST = BASE_URL +'get_items_by_os/'


//AD Users

export const ROLE_LIST= BASE_URL + 'roles-list/'
export const GRANTPERMISSION= BASE_URL + 'grant-access/'


//Events
export const  GETEVENTSDETAILS = BASE_URL + 'events/'// ?days=30&page'


//NETWORK TRAFFIC
export const NETWORK_TABLE = BASE_URL + 'get_network_data/?table=true&start_time=2024-11-18 00:00:00&end_time=2024-11-22 11:05:00'
export const NETWORK_GRAPH = BASE_URL + 'get_network_data/?graph=true&ip=172.30.131.214&start_time=2024-11-18 00:00:00&end_time=2024-11-22 11:05:00&metrics=in_octets,out_octets'


//NETWORK TRAFFIC DASHBOARD
export const TOP_10_ASSETS = BASE_URL + 'top_10_host_inbound_outbound/' // /?start_time=2024-12-02T12:00:00&end_time=2024-12-27T14:00:00'
export const GRAPH_PARAMETERS = BASE_URL + 'average_bandwidth/?interval=minute' //?start_time=2024-12-02T12:00:00&end_time=2024-12-27T14:00:00'
export const ASSETS_STATUS = BASE_URL + 'hosts_metrics/'


//ASSET DETAILS
 
export const ASSETDETAILS_TABLE = BASE_URL + 'hosts'
export const EVENTS_HOSTS = BASE_URL + 'events_hosts'


// Individual Asset Page
export const GetEvents = (param) => {
    return BASE_URL + 'events/' + param + '/'
}

// Individual Asset Graph API
export const GetGraphParam = (param) => {
    return BASE_URL + 'metrics_by_host/' + param + '/?interval=hour'
}


// Trace Route
export const TraceRoutingGraph = (param) => {
    return BASE_URL + 'live_traceroute_track/' + param + '/'
}

// Memory Utilization Graph
export const GetMemParam = (param) =>{
    return BASE_URL + 'metrics_by_host/' + param + '/?metrics=hrMemorySize'
}

// Asset Speed Graph
export const GetSpeedParam = (param) =>{
    return BASE_URL + 'metrics_by_host/' + param + '/?metrics=speed'
}

// Create Trace API
export const GetTrace = (id) => {
    return  'http://10.212.134.9:8000/api/create-trace/'
}

// Main Page API's
export const UpdateProblem = (param) =>{
    return BASE_URL + 'events/acknowledge/'+ param +'/';
}
