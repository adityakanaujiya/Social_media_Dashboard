import React, { useEffect, useState } from "react";
import axios from "axios";

function PostFeed() {
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts").then(res =>
      setPosts(res.data)
    );
  }, []);

  const createPost = async () => {
    const userId = "demoUser"; // replace with logged-in user
    await axios.post("http://localhost:5000/api/post", { userId, text, mediaUrl });
    // refresh posts after creating
    axios.get("http://localhost:5000/api/posts").then(res =>
      setPosts(res.data)
    );
    setText("");
    setMediaUrl("");
  };

  return (
    <div>
      <h2>Post Feed</h2>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind?" />
      <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Media URL" />
      <button onClick={createPost}>Post</button>
      {posts.map((p, i) => (
        <div key={i}>
          <p>{p.text}</p>
          {p.mediaUrl && <img src={p.mediaUrl} alt="" width={50} />}
        </div>
      ))}
    </div>
  );
}

export default PostFeed;
