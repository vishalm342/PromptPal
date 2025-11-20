const Footer = () => {
  return (
    <footer className="bg-[rgba(10,10,15,0.9)] border-t border-[#FFD700]/30 mt-auto">
      <div className="max-w-8xl mx-auto px-6 py-1 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-3">
          </div>
          <div>
            <p className="text-base text-gray-300 mb-2">
              Built with ❤️ by Vishal
            </p>
            <p className="text-sm text-gray-400">
              © <span className="text-[#FFD700]">PromptPal</span> 2025 • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
