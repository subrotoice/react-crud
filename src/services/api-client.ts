import axios from "axios";

export default axios.create({
  baseURL: "https://api.rawg.io/api",
  params: {
    key: "b0d7069520c04a5c8e168712f0464506",
  },
});
