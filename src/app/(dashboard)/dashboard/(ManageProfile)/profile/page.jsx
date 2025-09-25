import ManageProfile from "@/components/ManageProfile/ManageProfile";

export default function Page() {
  return (
    <div className="p-8">
      <ManageProfile role="rider" />
      <ManageProfile role="user" />
      <ManageProfile role="admin" />
      {/* role="rider" বা role="user" ও দিতে পারো */}
    </div>
  );
}
