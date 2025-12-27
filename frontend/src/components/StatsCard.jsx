export default function StatsCard({ title, value, color }) {
    return (
      <div className={`p-6 rounded-lg text-white ${color}`}>
        <h3 className="text-lg">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    );
  }
  