import axios from "axios";

export async function getUserData() {
  try {
    const res = await axios.get("/api/user");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user data", error);
    throw error;
  }
}
