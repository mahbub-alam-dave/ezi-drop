"use"
import TrackParcelTable from "./TrackParcelTable";

export default function TrackParcelPage() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        📦 Track Your Parcels
      </h1>
      <TrackParcelTable />
    </div>
  );
}
