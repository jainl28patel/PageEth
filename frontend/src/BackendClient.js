import axios from "axios";
import { BACKEND_HOST }from "./urls";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const BackendClient = axios.create({
  baseURL: BACKEND_HOST,
  withCredentials: false,
});

export default BackendClient;