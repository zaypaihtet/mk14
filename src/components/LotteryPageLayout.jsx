const LotteryPageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex justify-center">
      <div className="w-full max-w-[500px] bg-gradient-to-b from-blue-300 to-blue-400 relative">
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-400 relative mx-auto p-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LotteryPageLayout;
