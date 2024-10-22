import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Left Section */}
                    <div className="mb-4 md:mb-0">
                        <h4 className="text-lg font-bold mb-2">Sports Platform</h4>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Sports Platform. All rights reserved.
                        </p>
                    </div>

                    {/* Center Section: Links */}
                    <div className="flex space-x-6 mb-4 md:mb-0">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                    </div>

                    {/* Right Section: Social Media Links */}
                    <div className="flex space-x-4">
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775a4.92 4.92 0 0 0 2.163-2.724c-.951.555-2.005.959-3.127 1.184A4.903 4.903 0 0 0 16.616 3c-2.706 0-4.903 2.195-4.903 4.905 0 .385.045.76.127 1.122C7.728 8.802 4.1 6.865 1.671 3.917a4.822 4.822 0 0 0-.665 2.471c0 1.707.87 3.214 2.188 4.099a4.902 4.902 0 0 1-2.229-.616v.062c0 2.385 1.697 4.374 3.946 4.827a4.902 4.902 0 0 1-2.224.085 4.903 4.903 0 0 0 4.578 3.396 9.827 9.827 0 0 1-6.102 2.104c-.396 0-.788-.023-1.175-.067a13.905 13.905 0 0 0 7.557 2.213c9.056 0 14.002-7.506 14.002-14.002 0-.213-.005-.425-.014-.636a10.012 10.012 0 0 0 2.457-2.549z"/>
                            </svg>
                        </a>

                        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.325v21.351C0 23.403.596 24 1.325 24H12.82v-9.294H9.692V11.05h3.128V8.354c0-3.1 1.894-4.792 4.661-4.792 1.325 0 2.463.099 2.794.143v3.24h-1.916c-1.504 0-1.796.715-1.796 1.763v2.311h3.587l-.467 3.656h-3.12V24h6.116C23.403 24 24 23.403 24 22.675V1.325C24 .596 23.404 0 22.675 0z"/>
                            </svg>
                        </a>

                        <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46C0 23.21.79 24 1.77 24h20.46C23.21 24 24 23.21 24 22.23V1.77C24 .79 23.21 0 22.23 0zM7.12 20.45H3.56V9.03h3.56v11.42zM5.34 7.76c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.63c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.15 1.46-2.15 2.98v5.72h-3.56V9.03h3.42v1.56h.05c.48-.91 1.66-1.87 3.42-1.87 3.66 0 4.34 2.41 4.34 5.55v6.18z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
