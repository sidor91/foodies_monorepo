import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseUrl = import.meta.env.BACKEND_URL || "http://localhost:4000";
