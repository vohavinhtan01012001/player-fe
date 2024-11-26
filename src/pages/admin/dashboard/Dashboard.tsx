import SystemTotalAmount from "./components/SystemTotalAmount";
import TopPlayer from "./components/TopPlayer";
import TopPlayerWithFollow from "./components/TopPlayerWithFollow";
import TopPlayerWithMostLike from "./components/TopPlayerWithMostLike";
import TransactionHistory from "./components/TransactionHistory";
import TransactionVolume from "./components/TransactionVolume";

export default function Dashboard() {


  return (
    <div className="max-w-[1200px] mx-auto my-20">
       <div className="py-6">
        <SystemTotalAmount />
      </div>
      <div className="py-6">
        <TransactionVolume />
      </div>
      <div className="py-6">
        <TransactionHistory />
      </div>
      <div className="py-6">
        <TopPlayer />
      </div>
      <div className="py-6">
        <TopPlayerWithMostLike />
      </div>
      <div className="py-6">
        <TopPlayerWithFollow />
      </div>
    </div>
  );
}
