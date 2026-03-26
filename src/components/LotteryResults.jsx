import { Link } from "react-router-dom";

const LotteryGameCard = ({ title, logoUrl, closedMessage }) => {
  return (
    <div className="bg-blue-300 rounded-xl p-6 mb-4 shadow-lg">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <img src={logoUrl} alt={`${title} Logo`} className="h-12 w-auto" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {closedMessage && <p className="text-gray-700 mb-4">{closedMessage}</p>}
      </div>
    </div>
  );
};

const LotteryResults = () => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        နောက်ဆုံးထွက် နှစ်လုံးထီဂဏန်းများ
      </h2>

      <div className=" grid grid-cols-2 gap-4">
        <div>
          <Link to="/lottery-2d-result-detail">
            <LotteryGameCard
              gameType="myanmar_2d"
              title="Myanmar 2D"
              logoUrl="https://happy2d.com/static/media/mm_2d.47467f4e22ac93c09d7e.png"
              gradientClass="bg-gradient-to-br from-blue-500 to-blue-700"
              // closedMessage="ယနေ့ MM 2D ပိတ်ပါသည်။"
            />
          </Link>
        </div>
        <div>
          <Link to="/lottery-3d-result-detail">
            <LotteryGameCard
              gameType="myanmar_3d"
              title="Myanmar 3D"
              logoUrl="https://happy2d.com/static/media/mm_3d.3e7a8086638b55524ad4.png"
              gradientClass="bg-gradient-to-br from-purple-500 to-pink-500"
            />
          </Link>
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-4">
        <Link to="/dubai-2d-result">
          <LotteryGameCard
            gameType="dubai_2d"
            title="Dubai 2D"
            logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
            gradientClass="bg-gradient-to-br from-green-500 to-teal-600"
          />
        </Link>
        <Link to="/dubai-3d-result">
          <LotteryGameCard
            gameType="dubai_3d"
            title="Dubai 3D"
            logoUrl="https://happy2d.com/static/media/shwe_2d.9a41783662c55d81c7b5.png"
            gradientClass="bg-gradient-to-br from-yellow-400 to-orange-500"
          />
        </Link>
      </div>
      <div className=" grid grid-cols-2 gap-4">
        <Link to="/lottery-2d-result-detail">
          <LotteryGameCard
            gameType="mega_2d"
            title="Mega 2D"
            logoUrl="https://happy2d.com/static/media/dubai_2d.0190127030ca34a17e7e.png"
            gradientClass="bg-gradient-to-br from-green-500 to-teal-600"
          />
        </Link>
        <div></div>
      </div>
    </section>
  );
};

export default LotteryResults;
