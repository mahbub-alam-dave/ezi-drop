import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Star, CheckCircle, Trophy, Hash, TrendingUp, AlertCircle, DollarSign, XCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  ComposedChart,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function RiderPerformancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('6'); // months

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/rider-dashboard/rider-performance?months=${timeRange}`);
      const result = await res.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load performance data!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const successRate = useMemo(() => {
    if (!data) return 0;
    return data.totalDeliveries > 0
      ? ((data.successfulDeliveries / data.totalDeliveries) * 100).toFixed(1)
      : 0;
  }, [data]);

  const failureRate = useMemo(() => {
    if (!data) return 0;
    return data.totalDeliveries > 0
      ? ((data.cancelledDeliveries / data.totalDeliveries) * 100).toFixed(1)
      : 0;
  }, [data]);

  const avgRating = useMemo(() => {
    return data?.averageRating || 0;
  }, [data]);

  const pointsGoal = 5000;
  const pointsProgress = useMemo(() => {
    if (!data) return 0;
    return Math.min(100, Math.round(((data.totalPoints || 0) / pointsGoal) * 100));
  }, [data]);

  // Pie chart data for delivery status
  const deliveryStatusData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'Successful', value: data.successfulDeliveries, color: '#10b981' },
      { name: 'Cancelled', value: data.cancelledDeliveries, color: '#ef4444' },
      { 
        name: 'In Progress', 
        value: data.totalDeliveries - data.successfulDeliveries - data.cancelledDeliveries,
        color: '#f59e0b' 
      }
    ].filter(item => item.value > 0);
  }, [data]);

  // Spinner
  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading performance data...</p>
      </div>
    );
  }

  // No data
  if (!loading && !data) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] space-y-4">
        <AlertCircle size={64} className="text-gray-400" />
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          Performance Dashboard
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No performance data available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with time range filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          Performance Dashboard
        </h1>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Deliveries"
          value={data.totalDeliveries}
          icon={<Hash size={28} className="text-blue-500" />}
          bgColor="bg-blue-50 dark:bg-blue-900/20"
        />
        <MetricCard
          title="Successful"
          value={data.successfulDeliveries}
          icon={<CheckCircle size={28} className="text-green-500" />}
          progress={parseFloat(successRate)}
          progressLabel={`${successRate}% Success Rate`}
          color="from-emerald-400 to-cyan-500"
          bgColor="bg-green-50 dark:bg-green-900/20"
        />
        <MetricCard
          title="Cancelled"
          value={data.cancelledDeliveries}
          icon={<XCircle size={28} className="text-red-500" />}
          progress={parseFloat(failureRate)}
          progressLabel={`${failureRate}% Failed`}
          color="from-red-400 to-red-600"
          bgColor="bg-red-50 dark:bg-red-900/20"
        />
        <MetricCard
          title="Average Rating"
          value={
            <div className="flex items-center gap-1">
              {avgRating.toFixed(1)}
              <Star className="text-yellow-500 fill-yellow-500" size={18} />
            </div>
          }
          bgColor="bg-yellow-50 dark:bg-yellow-900/20"
        />
        <MetricCard
          title="Total Points"
          value={data.totalPoints}
          icon={<Trophy size={28} className="text-purple-500" />}
          progress={pointsProgress}
          progressLabel={`Goal: ${pointsGoal} pts`}
          color="from-amber-400 to-red-500"
          bgColor="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <DollarSign size={32} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Total Earnings
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              From all completed deliveries
            </p>
          </div>
        </div>
        <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
          ৳{data.totalEarnings?.toLocaleString() || 0}
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <TrendingUp size={16} />
          <span>Keep delivering to earn more!</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Deliveries Bar Chart */}
        <ChartCard title="📦 Monthly Deliveries">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="deliveries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Delivery Status Pie Chart */}
        <ChartCard title="📊 Delivery Status Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deliveryStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deliveryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Success & Points Line Chart */}
        <ChartCard title="✅ Success Rate & Points">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                strokeWidth={3}
                name="Successful"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#f97316"
                strokeWidth={3}
                name="Points"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Monthly Earnings */}
        <ChartCard title="💰 Monthly Earnings (৳)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`৳${value}`, "Amount"]}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#8b5cf6' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Daily Performance Chart (Last 30 Days) */}
      <ChartCard title="📈 Daily Performance Overview (Last 30 Days)">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Amount") return [`৳${value}`, "Amount"];
                if (name === "Deliveries") return [value, "Deliveries"];
                if (name === "Success Rate") return [`${value.toFixed(1)}%`, "Success Rate"];
                if (name === "Points") return [value, "Points"];
                return value;
              }}
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />

            <Bar
              dataKey="amount"
              fill="#3b82f6"
              name="Amount (৳)"
              radius={[5, 5, 0, 0]}
            />

            <Line
              type="monotone"
              dataKey="deliveries"
              stroke="#22c55e"
              strokeWidth={2}
              name="Deliveries"
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#facc15"
              strokeWidth={2}
              name="Success Rate"
              dot={{ r: 3 }}
            />

            <Line
              type="monotone"
              dataKey="points"
              stroke="#f97316"
              strokeWidth={2}
              name="Points"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Quick Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Quick Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Breakdown
            label="Successful Deliveries"
            value={data.successfulDeliveries}
            color="text-green-600 dark:text-green-400"
          />
          <Breakdown
            label="Cancelled Deliveries"
            value={data.cancelledDeliveries}
            color="text-red-600 dark:text-red-400"
          />
          <Breakdown
            label="Total Ratings"
            value={data.ratings?.length || 0}
            color="text-yellow-600 dark:text-yellow-400"
          />
          <Breakdown
            label="Total Earnings"
            value={`৳${data.totalEarnings?.toLocaleString() || 0}`}
            color="text-purple-600 dark:text-purple-400"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ title, value, icon, progress, progressLabel, color, bgColor }) {
  return (
    <div className={`${bgColor || 'bg-white dark:bg-gray-800'} rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {value}
          </div>
        </div>
        {icon && (
          <div className="p-2 bg-white/50 dark:bg-gray-700/50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color || 'from-blue-400 to-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {progressLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{progressLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );
}

function Breakdown({ label, value, color }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/30">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color || 'text-gray-800 dark:text-white'}`}>
        {value}
      </p>
    </div>
  );
}