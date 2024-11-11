import TopPlayer from "./components/TopPlayer";
import TopPlayerWithFollow from "./components/TopPlayerWithFollow";
import TopPlayerWithMostLike from "./components/TopPlayerWithMostLike";
import TransactionVolume from "./components/TransactionVolume";

export default function Dashboard() {


  return (
    <div className="max-w-[1200px] mx-auto my-20">
      <div className="py-6">
        <TransactionVolume />
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
