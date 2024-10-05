import React from 'react';
import Image from 'next/image'; // if using Image component from next.js

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Left side - Site name and social icons */}
        <div className="footer-left">
          <h2 className="site-name">Site name</h2>
          <div className="social-icons">
            <Image src="/facebook-icon.png" alt="Facebook" width={20} height={20} />
            <Image src="/linkedin-icon.png" alt="LinkedIn" width={20} height={20} />
            <Image src="/youtube-icon.png" alt="YouTube" width={20} height={20} />
            <Image src="/instagram-icon.png" alt="Instagram" width={20} height={20} />
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
