import React, { useEffect, useRef } from "react";
import axios from "axios";

function Analytics() {
  const chartRef = useRef();

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/demoUser")
      .then(res => {
        const ctx = chartRef.current.getContext("2d");
        new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Likes", "Comments", "Posts"],
            datasets: [{
              label: "Engagement",
              data: [res.data.likes, res.data.comments, res.data.posts],
            }],
          }
        });
      });
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      <canvas ref={chartRef} width={400} height={200}></canvas>
    </div>
  );
}

export default Analytics;
