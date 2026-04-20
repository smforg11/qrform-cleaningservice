import axios from "axios";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzwvSrKaCPw1kvD0ENwUpuGzLZRULOvJAxHVK7uoDN3UMQtavFasHfuaUgiU0FZebnj-w/exec";
async function testAPI() {
  try {
    const res = await axios.get(SCRIPT_URL);

    console.log("Status:", res.status);
    console.log("Response:", res.data);

    if (Array.isArray(res.data)) {
      console.log("✅ API OK (array response)");
    } else {
      console.log("⚠️ Response bukan array");
    }

  } catch (error) {
    console.log("❌ API ERROR:", error.message);
  }
}

testAPI();