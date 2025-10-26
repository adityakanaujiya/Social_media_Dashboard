import React, { useState } from "react";
import axios from "axios";

function Profile() {
  const [media, setMedia] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("media", e.target.files[0]);
    const res = await axios.post("http://localhost:5000/api/upload", formData);
    setUploadedUrl(res.data.url);
  };

  return (
    <div>
      <h2>Profile Image Upload</h2>
      <input type="file" onChange={handleUpload} />
      {uploadedUrl && <img src={uploadedUrl} alt="Profile" width={100} />}
    </div>
  );
}

export default Profile;
