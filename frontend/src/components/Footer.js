import React from 'react';

const Footer = () => (
  <footer className="bg-white shadow-inner mt-8">
    <div className="container mx-auto p-4 text-center text-gray-600">
      &copy; {new Date().getFullYear()} Countries Explorer. All rights reserved.
    </div>
  </footer>
);

export default Footer;