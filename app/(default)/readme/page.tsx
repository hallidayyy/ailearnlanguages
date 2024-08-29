"use client"; // 添加这一行来将组件标记为客户端组件

import React, { useEffect, useState } from 'react';

const AboutPage = () => {
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    fetch('/read.html')
      .then(response => response.text())
      .then(data => setReadmeContent(data))
      .catch(error => console.error('Error fetching README:', error));
  }, []);

  return (
    <div style={styles.container}>
      {/* Render the content of readme.html here */}
      <div dangerouslySetInnerHTML={{ __html: readmeContent }} />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
};

export default AboutPage;