

function BusList({ buses = [] }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">All Buses</h2>
          <p className="text-slate-600 text-sm mt-1">Live list from your database.</p>
        </div>
        <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
          LIST
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full bg-white">
        <thead>
          <tr className="bg-slate-50 text-slate-700">
            <th className="text-left p-3 text-sm font-semibold">Bus Number</th>
            <th className="text-left p-3 text-sm font-semibold">Driver</th>
            <th className="text-left p-3 text-sm font-semibold">Route</th>
            <th className="text-left p-3 text-sm font-semibold">Latitude</th>
            <th className="text-left p-3 text-sm font-semibold">Longitude</th>
          </tr>
        </thead>
        <tbody>
          {buses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-6 text-slate-600">
                No buses found
              </td>
            </tr>
          ) : (
            buses.map((bus, index) => (
              <tr
                key={bus._id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="p-3 border-t border-slate-200 font-semibold text-slate-900">{bus.busNumber}</td>
                <td className="p-3 border-t border-slate-200 text-slate-700">{bus.driverName}</td>
                <td className="p-3 border-t border-slate-200 text-slate-700">{bus.route}</td>
                <td className="p-3 border-t border-slate-200 text-slate-700">{bus.latitude}</td>
                <td className="p-3 border-t border-slate-200 text-slate-700">{bus.longitude}</td>
              </tr>
            ))
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusList;
