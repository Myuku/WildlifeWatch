"use client";  // Add this line at the top

import React from 'react';
import Image from 'next/image'; // if using Image component from next.js

export default function Footer() {
  const handleFacebookClick = () => {
    window.open('https://facebook.com', '_blank');
  };

  const handleLinkedInClick = () => {
    window.open('https://linkedin.com', '_blank');
  };

  const handleYouTubeClick = () => {
    window.open('https://youtube.com', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com', '_blank');
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Left side - Site name and social icons */}
        <div className="footer-left">
          <h2 className="site-name">Wildlife Watch</h2>
          <div className="social-icons">
            <button onClick={handleFacebookClick} aria-label="Facebook">
              <Image src="/facebook-svgrepo-com.svg" alt="Facebook" width={20} height={20} />
            </button>
            <button onClick={handleLinkedInClick} aria-label="LinkedIn">
              <Image src="/linkedin-linked-in-svgrepo-com.svg" alt="LinkedIn" width={20} height={20} />
            </button>
            <button onClick={handleYouTubeClick} aria-label="YouTube">
              <Image src="/youtube-you-tube-video-svgrepo-com.svg" alt="YouTube" width={20} height={20} />
            </button>
            <button onClick={handleInstagramClick} aria-label="Instagram">
              <Image src="/instagram-1-svgrepo-com.svg" alt="Instagram" width={20} height={20} />
            </button>
          </div>
        </div>

        {/* Right side - Topics and page links */}
        <div className="footer-right">
          <div className="footer-topic">
            <h3>Topic</h3>
            <ul>
              <li>Page</li>
              <li>Page</li>
              <li>Page</li>
            </ul>
          </div>
          <div className="footer-topic">
            <h3>Topic</h3>
            <ul>
              <li>Page</li>
              <li>Page</li>
              <li>Page</li>
            </ul>
          </div>
          <div className="footer-topic">
            <h3>Topic</h3>
            <ul>
              <li>Page</li>
              <li>Page</li>
              <li>Page</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
