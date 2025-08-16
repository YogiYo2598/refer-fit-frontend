const API_BASE = 'http://localhost:5000/api/upload/resume';

export const uploadResume =  async (file, fileName) => {
    const formData = new FormData();
    formData.append("resume", file);
    // console.log(fileName)
  
    const res = await fetch(`${API_BASE}/${fileName}`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });
  
    if (!res.ok) throw new Error("Failed to upload resume");
    const data = await res.json();
    return data.url;
  };